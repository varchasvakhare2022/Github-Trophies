// src/render.js

const fs = require("fs");
const path = require("path");
const { getTheme } = require("./themes");

const TROPHY_WIDTH = 200;
const TROPHY_HEIGHT = 200;
const TROPHY_GAP = 10;
const PADDING = 20;
const COLUMNS = 6;
const ROWS = 3;

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getRank(value, thresholds) {
  if (value >= thresholds.SPlus) return "S+";
  if (value >= thresholds.S) return "S";
  if (value >= thresholds.APlus) return "A+";
  if (value >= thresholds.A) return "A";
  if (value >= thresholds.BPlus) return "B+";
  if (value >= thresholds.B) return "B";
  if (value >= thresholds.CPlus) return "C+";
  if (value >= thresholds.C) return "C";
  return "D";
}

function getNextRankProgress(value, thresholds, currentRank) {
  // Get the next rank threshold
  let currentThreshold = 0;
  let nextThreshold = 0;
  
  if (currentRank === "S+") {
    return 1.0; // Max rank, 100% progress
  } else if (currentRank === "S") {
    currentThreshold = thresholds.S;
    nextThreshold = thresholds.SPlus;
  } else if (currentRank === "A+") {
    currentThreshold = thresholds.APlus;
    nextThreshold = thresholds.S;
  } else if (currentRank === "A") {
    currentThreshold = thresholds.A;
    nextThreshold = thresholds.APlus;
  } else if (currentRank === "B+") {
    currentThreshold = thresholds.BPlus;
    nextThreshold = thresholds.A;
  } else if (currentRank === "B") {
    currentThreshold = thresholds.B;
    nextThreshold = thresholds.BPlus;
  } else if (currentRank === "C+") {
    currentThreshold = thresholds.CPlus;
    nextThreshold = thresholds.B;
  } else if (currentRank === "C") {
    currentThreshold = thresholds.C;
    nextThreshold = thresholds.CPlus;
  } else {
    // D rank
    currentThreshold = 0;
    nextThreshold = thresholds.C;
  }
  
  if (nextThreshold === 0 || nextThreshold === currentThreshold) {
    return 1.0;
  }
  
  const progress = (value - currentThreshold) / (nextThreshold - currentThreshold);
  return Math.min(Math.max(progress, 0), 1.0);
}

function getAchievementTitle(title, rank) {
  const titles = {
    "Stars": {
      "S+": "Super Stargazer",
      "S": "Stargazer",
      "A+": "High Stargazer",
      "A": "Super Star",
      "B+": "High Star",
      "B": "Middle Star",
      "C+": "First Star",
      "C": "First Star",
      "D": "No Stars"
    },
    "Commits": {
      "S+": "God Committer",
      "S": "Super Committer",
      "A+": "Ultra Committer",
      "A": "Ultra Committer",
      "B+": "Hyper Committer",
      "B": "High Committer",
      "C+": "Middle Committer",
      "C": "First Commit",
      "D": "No Commits"
    },
    "PullRequest": {
      "S+": "God Puller",
      "S": "Super Puller",
      "A+": "Ultra Puller",
      "A": "High Puller",
      "B+": "Middle Puller",
      "B": "Middle PR User",
      "C+": "First Pull",
      "C": "First Pull",
      "D": "No PRs"
    },
    "Issues": {
      "S+": "God Issuer",
      "S": "Super Issuer",
      "A+": "Ultra Issuer",
      "A": "High Issuer",
      "B+": "Middle Issuer",
      "B": "Middle Issuer",
      "C+": "First Issue",
      "C": "First Issue",
      "D": "No Issues"
    },
    "Repositories": {
      "S+": "God Repo Creator",
      "S": "Super Repo Creator",
      "A+": "Ultra Repo Creator",
      "A": "Hyper Repo Creator",
      "B+": "High Repo Creator",
      "B": "Middle Repo Creator",
      "C+": "First Repository",
      "C": "First Repository",
      "D": "No Repos"
    },
    "Followers": {
      "S+": "Super Celebrity",
      "S": "Hyper Celebrity",
      "A+": "Famous User",
      "A": "Dynamic User",
      "B+": "Active User",
      "B": "Many Friends",
      "C+": "First Friend",
      "C": "First Friend",
      "D": "No Followers"
    }
  };
  
  return titles[title]?.[rank] || "Achievement";
}

function getRankColor(rank, theme) {
  const colors = {
    "S+": "#ff6b6b",
    "S": "#ff8787",
    "A+": "#ffa94d",
    "A": "#ffc078",
    "B+": "#51cf66",
    "B": "#69db7c",
    "C+": "#339af0",
    "C": "#4dabf7",
    "D": "#868e96"
  };
  return colors[rank] || theme.accent;
}

// Cache for base64 encoded PNG images
const trophyImageCache = {};

function getTrophyImageBase64(rank) {
  // Map rank to PNG filename
  const rankMap = {
    "S+": "S-Rank red trophy.png",
    "S": "S-Rank red trophy.png",
    "A+": "A-Rank gold trophy.png",
    "A": "A-Rank gold trophy.png",
    "B+": "B-Rank gold trophy.png",
    "B": "B-Rank gold trophy.png",
    "C+": "C-Rank silver trophy.png",
    "C": "C-Rank silver trophy.png",
    "D": "D-Rank bronze trophy.png"
  };
  
  const filename = rankMap[rank] || "D-Rank bronze trophy.png";
  
  // Return cached version if available
  if (trophyImageCache[filename]) {
    return trophyImageCache[filename];
  }
  
  // Load PNG file and convert to base64
  try {
    const imagePath = path.join(__dirname, "..", "assets", filename);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString("base64");
    const dataUri = `data:image/png;base64,${base64}`;
    
    // Cache it
    trophyImageCache[filename] = dataUri;
    return dataUri;
  } catch (error) {
    console.error(`Error loading trophy image ${filename}:`, error);
    // Return empty string or a fallback
    return "";
  }
}

function getTrophyIcon(rank, color) {
  // Account for title at top (~25px) and text/progress bar at bottom (~35px)
  // Center in the remaining space, moved up slightly
  const centerX = TROPHY_WIDTH / 2;
  const topSpace = 25; // Space for title
  const bottomSpace = 35; // Space for achievement text and progress bar
  const availableHeight = TROPHY_HEIGHT - topSpace - bottomSpace;
  const centerY = topSpace + availableHeight / 2 - 8; // Center in available vertical space, moved up by 8px
  
  // Check if rank has a "+" symbol
  const rankStr = String(rank).trim();
  const hasPlus = rankStr.includes("+");
  const baseRank = hasPlus ? rankStr.replace("+", "").trim() : rankStr;
  
  // Get the base64 image data for the trophy
  const imageDataUri = getTrophyImageBase64(rank);
  
  if (!imageDataUri) {
    // Fallback: return empty string if image can't be loaded
    return "";
  }
  
  // Trophy image size (adjust based on your PNG dimensions) - increased size
  const trophySize = 150; // Main trophy size (increased from 120)
  const smallTrophySize = 85; // Smaller trophy size for "+" ranks (increased proportionally)
  
  // Medallion position within trophy (estimated - adjust based on actual PNG)
  // The medallion is typically in the center area of the trophy, slightly below top
  // Fine-tuned to better match actual PNG medallion position
  const medallionOffsetY = trophySize * 0.45; // Proportional offset (45% from top - adjusted down)
  const smallMedallionOffsetY = smallTrophySize * 0.45; // Proportional for smaller trophy
  
  // Helper function to create grade text overlay
  const createGradeText = (trophyX, trophyY, trophySize, letter, fontSize, medallionOffset, verticalAdjust = -16) => {
    // Calculate medallion center position relative to trophy image
    const medallionX = trophyX + trophySize / 2; // Center horizontally
    // Add small vertical adjustment to move text up/down
    const medallionY = trophyY + medallionOffset + verticalAdjust;
    
    return `
      <text
        x="${medallionX}"
        y="${medallionY}"
        font-family="Georgia, serif"
        font-weight="bold"
        font-size="${fontSize}"
        fill="#5d4037"
        text-anchor="middle"
        dominant-baseline="central"
        opacity="1"
        style="text-shadow: 0 1px 2px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.1);">
        ${letter}
      </text>
    `;
  };
  
  // If rank has "+", render two trophies: main and smaller one
  if (hasPlus && rankStr.includes("+")) {
    // Calculate positions to center the group
    const groupOffset = 30; // Spacing between trophies (increased for larger trophies)
    const mainTrophyX = centerX - groupOffset - trophySize / 2;
    const smallTrophyX = centerX + groupOffset - smallTrophySize / 2;
    const mainTrophyY = centerY - trophySize / 2;
    const smallTrophyY = centerY - smallTrophySize / 2 + 4; // Slightly lower to appear behind
    
    return `
      <!-- Smaller trophy (behind) -->
      <image
        x="${smallTrophyX}"
        y="${smallTrophyY}"
        width="${smallTrophySize}"
        height="${smallTrophySize}"
        href="${imageDataUri}"
        opacity="0.9"
      />
      ${createGradeText(smallTrophyX, smallTrophyY, smallTrophySize, baseRank, 20, smallMedallionOffsetY, -10)}
      <!-- Main trophy (in front) -->
      <image
        x="${mainTrophyX}"
        y="${mainTrophyY}"
        width="${trophySize}"
        height="${trophySize}"
        href="${imageDataUri}"
      />
      ${createGradeText(mainTrophyX, mainTrophyY, trophySize, baseRank, 32, medallionOffsetY)}
    `;
  } else {
    // Single trophy for ranks without "+"
    const trophyX = centerX - trophySize / 2;
    const trophyY = centerY - trophySize / 2;
    
    return `
      <image
        x="${trophyX}"
        y="${trophyY}"
        width="${trophySize}"
        height="${trophySize}"
        href="${imageDataUri}"
      />
      ${createGradeText(trophyX, trophyY, trophySize, rankStr, 32, medallionOffsetY)}
    `;
  }
}

function renderPanels(user, themeName, options = {}) {
  const theme = getTheme(themeName);
  const column = options.column || COLUMNS;
  const row = options.row || ROWS;
  const marginW = options.marginW;
  const marginH = options.marginH;
  const noBg = options.noBg === "true" || options.noBg === true;
  const noFrame = options.noFrame === "true" || options.noFrame === true;

  // Define trophies with thresholds
  const trophies = [
    {
      title: "Stars",
      value: Number(user.totalStars) || 0,
      thresholds: { SPlus: 1000, S: 500, APlus: 250, A: 100, BPlus: 50, B: 25, CPlus: 10, C: 1 }
    },
    {
      title: "Commits",
      value: Number(user.commits) || 0, // Would need to fetch from events API
      thresholds: { SPlus: 10000, S: 5000, APlus: 2500, A: 1000, BPlus: 500, B: 250, CPlus: 100, C: 1 }
    },
    {
      title: "PullRequest",
      value: Number(user.pullRequests) || 0, // Would need to fetch from events API
      thresholds: { SPlus: 500, S: 250, APlus: 100, A: 50, BPlus: 25, B: 10, CPlus: 5, C: 1 }
    },
    {
      title: "Issues",
      value: Number(user.issues) || 0, // Would need to fetch from events API
      thresholds: { SPlus: 500, S: 250, APlus: 100, A: 50, BPlus: 25, B: 10, CPlus: 5, C: 1 }
    },
    {
      title: "Repositories",
      value: Number(user.publicRepos) || 0,
      thresholds: { SPlus: 100, S: 50, APlus: 25, A: 10, BPlus: 5, B: 2, CPlus: 1, C: 0 }
    },
    {
      title: "Followers",
      value: Number(user.followers) || 0,
      thresholds: { SPlus: 1000, S: 500, APlus: 250, A: 100, BPlus: 50, B: 25, CPlus: 10, C: 1 }
    }
  ];

  // Calculate ranks and filter visible trophies
  const visibleTrophies = trophies
    .map(trophy => {
      const rank = getRank(trophy.value, trophy.thresholds);
      return {
        ...trophy,
        rank: rank,
        color: getRankColor(rank, theme),
        achievementTitle: getAchievementTitle(trophy.title, rank),
        progress: getNextRankProgress(trophy.value, trophy.thresholds, rank)
      };
    })
    .filter((trophy, index) => {
      if (column === -1) return true; // Adaptive column
      const col = index % column;
      const r = Math.floor(index / column);
      return col < column && r < row;
    })
    .slice(0, column === -1 ? trophies.length : column * row);

  const actualColumns = column === -1 ? Math.ceil(Math.sqrt(visibleTrophies.length)) : column;
  const actualRows = column === -1 ? Math.ceil(visibleTrophies.length / actualColumns) : row;

  // Use marginW/marginH if provided, otherwise use TROPHY_GAP
  const gapW = marginW !== undefined ? marginW : TROPHY_GAP;
  const gapH = marginH !== undefined ? marginH : TROPHY_GAP;

  const width = PADDING * 2 + (TROPHY_WIDTH + gapW) * actualColumns - gapW;
  // Calculate exact height: Progress bar is at y="${TROPHY_HEIGHT - 12}" with height 6
  // So progress bar ends at TROPHY_HEIGHT - 12 + 6 = TROPHY_HEIGHT - 6 = 194px from card top
  // Last row card starts at: PADDING + (TROPHY_HEIGHT + gapH) * (actualRows - 1)
  // Progress bar ends at: lastRowCardStart + (TROPHY_HEIGHT - 6)
  // Crop more aggressively to eliminate ALL space - crop to where progress bar actually ends
  const lastRowCardStart = PADDING + (TROPHY_HEIGHT + gapH) * (actualRows - 1);
  const progressBarEnd = lastRowCardStart + (TROPHY_HEIGHT - 6); // Progress bar ends at 194px from card top
  const height = Math.floor(progressBarEnd - 10); // Crop 10px aggressively to eliminate all space

  const isVampireTheme = themeName && themeName.toLowerCase() === 'vampire';

  const trophySvg = visibleTrophies
    .map((trophy, index) => {
      const col = index % actualColumns;
      const r = Math.floor(index / actualColumns);
      const x = PADDING + col * (TROPHY_WIDTH + gapW);
      const y = PADDING + r * (TROPHY_HEIGHT + gapH);

      return `
        <g transform="translate(${x}, ${y})">
          ${!noFrame ? `<rect
            width="${TROPHY_WIDTH}"
            height="${TROPHY_HEIGHT}"
            rx="8"
            fill="${noBg ? "transparent" : theme.cardBg}"
            stroke="${theme.border}"
            stroke-width="2"
          />` : ""}
          <text
            x="${TROPHY_WIDTH / 2}"
            y="28"
            font-size="24"
            font-weight="600"
            fill="${theme.text}"
            text-anchor="middle"
            font-family="Segoe UI,Helvetica,Arial,sans-serif"
          >
            ${escapeXml(trophy.title)}
          </text>
          ${getTrophyIcon(trophy.rank, trophy.color)}
          <!-- Achievement title and value above progress bar -->
          <text
            x="${TROPHY_WIDTH / 2}"
            y="${TROPHY_HEIGHT - 36}"
            font-size="16"
            font-weight="bold"
            fill="${theme.text}"
            text-anchor="middle"
            font-family="Arial, sans-serif"
            opacity="0.7"
          >
            ${escapeXml(trophy.achievementTitle)}
          </text>
          <text
            x="${TROPHY_WIDTH / 2}"
            y="${TROPHY_HEIGHT - 18}"
            font-size="15"
            font-weight="bold"
            fill="${theme.text}"
            text-anchor="middle"
            font-family="Arial, sans-serif"
            opacity="0.7"
          >
            ${escapeXml(String(trophy.value))}pt
          </text>
          <!-- Progress bar at the bottom -->
          <rect
            x="20"
            y="${TROPHY_HEIGHT - 12}"
            width="${TROPHY_WIDTH - 40}"
            height="6"
            rx="3"
            fill="${theme.border}"
            opacity="1"
          />
          <rect
            x="20"
            y="${TROPHY_HEIGHT - 12}"
            width="${(TROPHY_WIDTH - 40) * trophy.progress}"
            height="6"
            rx="3"
            fill="${isVampireTheme ? '#dc2626' : (trophy.rank === 'S+' ? '#ffd700' : trophy.color)}"
            opacity="0.8"
          />
        </g>
      `;
    })
    .join("");

  const clipId = `clip-${Math.random().toString(36).substr(2, 9)}`;
  // Ensure viewBox matches height exactly (both as integers)
  const viewBoxHeight = Math.floor(height);
  return `<svg width="${Math.floor(width)}" height="${height}" viewBox="0 0 ${Math.floor(width)} ${viewBoxHeight}" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" style="display: block !important; vertical-align: bottom !important; margin: 0 !important; padding: 0 !important; border: 0 !important; line-height: 0 !important; height: ${height}px !important; max-height: ${height}px !important; overflow: hidden !important; box-sizing: border-box !important;"><defs><clipPath id="${clipId}"><rect x="0" y="0" width="${Math.floor(width)}" height="${viewBoxHeight}"/></clipPath></defs><g clip-path="url(#${clipId})">${trophySvg}</g><title>${escapeXml(user.name)}'s GitHub Trophies</title><desc>Dynamic GitHub profile trophies showing achievements.</desc></svg>`;
}

module.exports = { renderPanels };
