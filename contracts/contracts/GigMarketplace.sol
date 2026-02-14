// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GigMarketplace
 * @notice Trustless escrow marketplace for on-chain gigs.
 *         Hirers post jobs with ERC20 rewards locked in escrow.
 *         Agents apply, deliver work, and get paid upon hirer approval.
 */
contract GigMarketplace is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ──────────────────────────── Types ────────────────────────────

    enum JobStatus {
        Open,       // 0 — accepting applications
        InProgress, // 1 — agent assigned, working
        Review,     // 2 — work submitted, awaiting hirer approval
        Completed,  // 3 — hirer approved, funds released
        Cancelled   // 4 — hirer cancelled before assignment
    }

    struct Job {
        address hirer;
        address agent;
        IERC20  token;
        uint256 reward;
        string  metadataCid;   // IPFS CID for job description
        uint256 deadline;      // block.timestamp-based deadline
        JobStatus status;
        string  evidenceCid;   // IPFS CID for delivered work
    }

    // ──────────────────────────── State ────────────────────────────

    uint256 public jobCount;
    mapping(uint256 => Job) private _jobs;

    // Indexes for convenient lookups
    mapping(address => uint256[]) private _hirerJobs;
    mapping(address => uint256[]) private _agentJobs;

    // ──────────────────────────── Events ───────────────────────────

    event JobPosted(
        uint256 indexed jobId,
        address indexed hirer,
        address token,
        uint256 reward,
        string metadataCid,
        uint256 deadline
    );

    event JobApplied(uint256 indexed jobId, address indexed agent);
    event WorkSubmitted(uint256 indexed jobId, string evidenceCid);
    event WorkApproved(uint256 indexed jobId, address indexed agent, uint256 reward);
    event JobCancelled(uint256 indexed jobId);

    // ──────────────────────────── Errors ───────────────────────────

    error InvalidReward();
    error InvalidDuration();
    error JobNotOpen();
    error JobNotInProgress();
    error JobNotInReview();
    error NotHirer();
    error NotAgent();
    error AlreadyAssigned();

    // ──────────────────────────── Write ────────────────────────────

    /**
     * @notice Post a new job with escrowed ERC20 reward.
     * @param token   ERC20 token used for payment.
     * @param reward  Amount of tokens locked as reward.
     * @param metadataCid IPFS CID of the job description.
     * @param duration Seconds until the job deadline.
     * @return jobId  ID of the newly created job.
     */
    function postJob(
        address token,
        uint256 reward,
        string calldata metadataCid,
        uint256 duration
    ) external nonReentrant returns (uint256 jobId) {
        if (reward == 0) revert InvalidReward();
        if (duration == 0) revert InvalidDuration();

        // Pull tokens into escrow
        IERC20(token).safeTransferFrom(msg.sender, address(this), reward);

        jobId = jobCount++;

        _jobs[jobId] = Job({
            hirer: msg.sender,
            agent: address(0),
            token: IERC20(token),
            reward: reward,
            metadataCid: metadataCid,
            deadline: block.timestamp + duration,
            status: JobStatus.Open,
            evidenceCid: ""
        });

        _hirerJobs[msg.sender].push(jobId);

        emit JobPosted(jobId, msg.sender, token, reward, metadataCid, block.timestamp + duration);
    }

    /**
     * @notice Agent applies to an open job.
     */
    function applyToJob(uint256 jobId) external {
        Job storage job = _jobs[jobId];
        if (job.status != JobStatus.Open) revert JobNotOpen();
        if (job.agent != address(0)) revert AlreadyAssigned();

        job.agent = msg.sender;
        job.status = JobStatus.InProgress;

        _agentJobs[msg.sender].push(jobId);

        emit JobApplied(jobId, msg.sender);
    }

    /**
     * @notice Agent submits work evidence (IPFS CID).
     */
    function submitWork(uint256 jobId, string calldata evidenceCid) external {
        Job storage job = _jobs[jobId];
        if (job.status != JobStatus.InProgress) revert JobNotInProgress();
        if (job.agent != msg.sender) revert NotAgent();

        job.evidenceCid = evidenceCid;
        job.status = JobStatus.Review;

        emit WorkSubmitted(jobId, evidenceCid);
    }

    /**
     * @notice Hirer approves work and releases escrowed tokens to the agent.
     */
    function approveWork(uint256 jobId) external nonReentrant {
        Job storage job = _jobs[jobId];
        if (job.status != JobStatus.Review) revert JobNotInReview();
        if (job.hirer != msg.sender) revert NotHirer();

        job.status = JobStatus.Completed;

        // Release escrow to agent
        job.token.safeTransfer(job.agent, job.reward);

        emit WorkApproved(jobId, job.agent, job.reward);
    }

    /**
     * @notice Hirer cancels an open job and reclaims escrowed tokens.
     */
    function cancelJob(uint256 jobId) external nonReentrant {
        Job storage job = _jobs[jobId];
        if (job.status != JobStatus.Open) revert JobNotOpen();
        if (job.hirer != msg.sender) revert NotHirer();

        job.status = JobStatus.Cancelled;

        // Refund hirer
        job.token.safeTransfer(job.hirer, job.reward);

        emit JobCancelled(jobId);
    }

    // ──────────────────────────── Read ─────────────────────────────

    /**
     * @notice Returns the full Job struct for a given ID.
     */
    function getJob(uint256 jobId) external view returns (Job memory) {
        return _jobs[jobId];
    }

    /**
     * @notice Returns job IDs posted by the given hirer.
     */
    function getJobsByHirer(address hirer) external view returns (uint256[] memory) {
        return _hirerJobs[hirer];
    }

    /**
     * @notice Returns job IDs assigned to the given agent.
     */
    function getJobsByAgent(address agent) external view returns (uint256[] memory) {
        return _agentJobs[agent];
    }
}
