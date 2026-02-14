import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("GigMarketplace", function () {
  const ONE_DAY = 86400;
  const REWARD = ethers.parseEther("100"); // 100 GIG

  async function deployFixture() {
    const [deployer, hirer, agent, other] = await ethers.getSigners();

    // Deploy MockGIG token
    const MockGIG = await ethers.getContractFactory("MockGIG");
    const token = await MockGIG.deploy();

    // Deploy GigMarketplace
    const GigMarketplace = await ethers.getContractFactory("GigMarketplace");
    const marketplace = await GigMarketplace.deploy();

    // Give hirer some tokens
    await token.mint(hirer.address, ethers.parseEther("10000"));

    return { deployer, hirer, agent, other, token, marketplace };
  }

  // ─────────────── MockGIG Tests ───────────────

  describe("MockGIG", function () {
    it("should deploy with correct name and symbol", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.name()).to.equal("GIG Token");
      expect(await token.symbol()).to.equal("GIG");
    });

    it("should mint 1M tokens to deployer", async function () {
      const { deployer, token } = await loadFixture(deployFixture);
      expect(await token.balanceOf(deployer.address)).to.equal(
        ethers.parseEther("1000000")
      );
    });

    it("should allow anyone to mint", async function () {
      const { other, token } = await loadFixture(deployFixture);
      await token.connect(other).mint(other.address, ethers.parseEther("500"));
      expect(await token.balanceOf(other.address)).to.equal(
        ethers.parseEther("500")
      );
    });
  });

  // ─────────────── postJob ───────────────

  describe("postJob", function () {
    it("should create a job and escrow tokens", async function () {
      const { hirer, token, marketplace } = await loadFixture(deployFixture);

      await token.connect(hirer).approve(marketplace.target, REWARD);
      await expect(
        marketplace
          .connect(hirer)
          .postJob(token.target, REWARD, "QmTestCid123", ONE_DAY)
      )
        .to.emit(marketplace, "JobPosted")
        .withArgs(
          0,
          hirer.address,
          token.target,
          REWARD,
          "QmTestCid123",
          (v: bigint) => v > 0n // deadline
        );

      const job = await marketplace.getJob(0);
      expect(job.hirer).to.equal(hirer.address);
      expect(job.reward).to.equal(REWARD);
      expect(job.status).to.equal(0); // Open
      expect(await token.balanceOf(marketplace.target)).to.equal(REWARD);
    });

    it("should revert if reward is 0", async function () {
      const { hirer, token, marketplace } = await loadFixture(deployFixture);
      await expect(
        marketplace
          .connect(hirer)
          .postJob(token.target, 0, "QmTestCid123", ONE_DAY)
      ).to.be.revertedWithCustomError(marketplace, "InvalidReward");
    });

    it("should revert if duration is 0", async function () {
      const { hirer, token, marketplace } = await loadFixture(deployFixture);
      await token.connect(hirer).approve(marketplace.target, REWARD);
      await expect(
        marketplace
          .connect(hirer)
          .postJob(token.target, REWARD, "QmTestCid123", 0)
      ).to.be.revertedWithCustomError(marketplace, "InvalidDuration");
    });

    it("should increment jobCount", async function () {
      const { hirer, token, marketplace } = await loadFixture(deployFixture);
      await token.connect(hirer).approve(marketplace.target, REWARD * 2n);

      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid1", ONE_DAY);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid2", ONE_DAY);

      expect(await marketplace.jobCount()).to.equal(2);
    });
  });

  // ─────────────── applyToJob ───────────────

  describe("applyToJob", function () {
    it("should assign agent and set InProgress", async function () {
      const { hirer, agent, token, marketplace } =
        await loadFixture(deployFixture);

      await token.connect(hirer).approve(marketplace.target, REWARD);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid", ONE_DAY);

      await expect(marketplace.connect(agent).applyToJob(0))
        .to.emit(marketplace, "JobApplied")
        .withArgs(0, agent.address);

      const job = await marketplace.getJob(0);
      expect(job.agent).to.equal(agent.address);
      expect(job.status).to.equal(1); // InProgress
    });

    it("should revert if job is not Open", async function () {
      const { hirer, agent, other, token, marketplace } =
        await loadFixture(deployFixture);

      await token.connect(hirer).approve(marketplace.target, REWARD);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid", ONE_DAY);
      await marketplace.connect(agent).applyToJob(0);

      await expect(
        marketplace.connect(other).applyToJob(0)
      ).to.be.revertedWithCustomError(marketplace, "JobNotOpen");
    });
  });

  // ─────────────── submitWork ───────────────

  describe("submitWork", function () {
    it("should submit evidence and set Review", async function () {
      const { hirer, agent, token, marketplace } =
        await loadFixture(deployFixture);

      await token.connect(hirer).approve(marketplace.target, REWARD);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid", ONE_DAY);
      await marketplace.connect(agent).applyToJob(0);

      await expect(
        marketplace.connect(agent).submitWork(0, "QmEvidenceCid")
      )
        .to.emit(marketplace, "WorkSubmitted")
        .withArgs(0, "QmEvidenceCid");

      const job = await marketplace.getJob(0);
      expect(job.evidenceCid).to.equal("QmEvidenceCid");
      expect(job.status).to.equal(2); // Review
    });

    it("should revert if caller is not the agent", async function () {
      const { hirer, agent, other, token, marketplace } =
        await loadFixture(deployFixture);

      await token.connect(hirer).approve(marketplace.target, REWARD);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid", ONE_DAY);
      await marketplace.connect(agent).applyToJob(0);

      await expect(
        marketplace.connect(other).submitWork(0, "QmFake")
      ).to.be.revertedWithCustomError(marketplace, "NotAgent");
    });
  });

  // ─────────────── approveWork ───────────────

  describe("approveWork", function () {
    it("should release escrow to agent and set Completed", async function () {
      const { hirer, agent, token, marketplace } =
        await loadFixture(deployFixture);

      await token.connect(hirer).approve(marketplace.target, REWARD);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid", ONE_DAY);
      await marketplace.connect(agent).applyToJob(0);
      await marketplace.connect(agent).submitWork(0, "QmEvidence");

      const agentBalBefore = await token.balanceOf(agent.address);

      await expect(marketplace.connect(hirer).approveWork(0))
        .to.emit(marketplace, "WorkApproved")
        .withArgs(0, agent.address, REWARD);

      const job = await marketplace.getJob(0);
      expect(job.status).to.equal(3); // Completed

      const agentBalAfter = await token.balanceOf(agent.address);
      expect(agentBalAfter - agentBalBefore).to.equal(REWARD);

      // Marketplace balance should be 0
      expect(await token.balanceOf(marketplace.target)).to.equal(0);
    });

    it("should revert if caller is not the hirer", async function () {
      const { hirer, agent, token, marketplace } =
        await loadFixture(deployFixture);

      await token.connect(hirer).approve(marketplace.target, REWARD);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid", ONE_DAY);
      await marketplace.connect(agent).applyToJob(0);
      await marketplace.connect(agent).submitWork(0, "QmEvidence");

      await expect(
        marketplace.connect(agent).approveWork(0)
      ).to.be.revertedWithCustomError(marketplace, "NotHirer");
    });
  });

  // ─────────────── cancelJob ───────────────

  describe("cancelJob", function () {
    it("should refund hirer and set Cancelled", async function () {
      const { hirer, token, marketplace } = await loadFixture(deployFixture);

      await token.connect(hirer).approve(marketplace.target, REWARD);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid", ONE_DAY);

      const hirerBalBefore = await token.balanceOf(hirer.address);

      await expect(marketplace.connect(hirer).cancelJob(0))
        .to.emit(marketplace, "JobCancelled")
        .withArgs(0);

      const job = await marketplace.getJob(0);
      expect(job.status).to.equal(4); // Cancelled

      const hirerBalAfter = await token.balanceOf(hirer.address);
      expect(hirerBalAfter - hirerBalBefore).to.equal(REWARD);
    });

    it("should revert if job is not Open", async function () {
      const { hirer, agent, token, marketplace } =
        await loadFixture(deployFixture);

      await token.connect(hirer).approve(marketplace.target, REWARD);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid", ONE_DAY);
      await marketplace.connect(agent).applyToJob(0);

      await expect(
        marketplace.connect(hirer).cancelJob(0)
      ).to.be.revertedWithCustomError(marketplace, "JobNotOpen");
    });

    it("should revert if caller is not the hirer", async function () {
      const { hirer, other, token, marketplace } =
        await loadFixture(deployFixture);

      await token.connect(hirer).approve(marketplace.target, REWARD);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid", ONE_DAY);

      await expect(
        marketplace.connect(other).cancelJob(0)
      ).to.be.revertedWithCustomError(marketplace, "NotHirer");
    });
  });

  // ─────────────── Read functions ───────────────

  describe("Read functions", function () {
    it("getJobsByHirer returns correct job IDs", async function () {
      const { hirer, token, marketplace } = await loadFixture(deployFixture);

      await token.connect(hirer).approve(marketplace.target, REWARD * 2n);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid1", ONE_DAY);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid2", ONE_DAY);

      const ids = await marketplace.getJobsByHirer(hirer.address);
      expect(ids.length).to.equal(2);
      expect(ids[0]).to.equal(0);
      expect(ids[1]).to.equal(1);
    });

    it("getJobsByAgent returns correct job IDs", async function () {
      const { hirer, agent, token, marketplace } =
        await loadFixture(deployFixture);

      await token.connect(hirer).approve(marketplace.target, REWARD);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "Cid", ONE_DAY);
      await marketplace.connect(agent).applyToJob(0);

      const ids = await marketplace.getJobsByAgent(agent.address);
      expect(ids.length).to.equal(1);
      expect(ids[0]).to.equal(0);
    });
  });

  // ─────────────── Full E2E flow ───────────────

  describe("Full flow: post → apply → submit → approve", function () {
    it("completes successfully end-to-end", async function () {
      const { hirer, agent, token, marketplace } =
        await loadFixture(deployFixture);

      // 1. Hirer posts job
      await token.connect(hirer).approve(marketplace.target, REWARD);
      await marketplace
        .connect(hirer)
        .postJob(token.target, REWARD, "QmJobDescription", ONE_DAY);

      // 2. Agent applies
      await marketplace.connect(agent).applyToJob(0);

      // 3. Agent submits work
      await marketplace.connect(agent).submitWork(0, "QmWorkEvidence");

      // 4. Hirer approves
      await marketplace.connect(hirer).approveWork(0);

      // Verify final state
      const job = await marketplace.getJob(0);
      expect(job.status).to.equal(3); // Completed
      expect(job.evidenceCid).to.equal("QmWorkEvidence");
      expect(await token.balanceOf(agent.address)).to.equal(REWARD);
      expect(await token.balanceOf(marketplace.target)).to.equal(0);
    });
  });
});
