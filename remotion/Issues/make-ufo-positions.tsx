import { noise2D } from "@remotion/noise";
import { interpolate, spring } from "remotion";
import { VIDEO_HEIGHT } from "../../types/constants";
import { getShotsToFire } from "./get-shots-to-fire";
import { sampleUniqueIndices } from "./sample-indices";
import { UFO_HEIGHT, UFO_WIDTH } from "./Ufo";

export const CANVAS_WIDTH = 1080;
export const PADDING = 100;
export const USABLE_CANVAS_WIDTH = CANVAS_WIDTH - PADDING * 2;
export const ROCKET_ORIGIN_X = CANVAS_WIDTH / 2;
export const ROCKET_ORIGIN_Y = CANVAS_WIDTH - 150;
export const TIME_BEFORE_SHOOTING = 60;
export const SHOOT_DURATION = 14;

export type BaseUfoPosition = {
  x: number;
  y: number;
  scale: number;
};

export type UfoPosition = BaseUfoPosition & {
  shootDelay: number;
  shootDuration: number;
  isClosed: boolean;
};

const issuesPerRow = (numberOfIssues: number) => {
  if (numberOfIssues < 4) {
    return 3;
  }
  if (numberOfIssues < 15) {
    return 4;
  }
  if (numberOfIssues < 30) {
    return 6;
  }
  return 8;
};

export const FPS = 30;

const makeYPosition = ({
  correctionToTop,
  entranceYOffset,
  frame,
  row,
  column,
  rowHeight,
}: {
  row: number;
  column: number;
  rowHeight: number;
  frame: number;
  entranceYOffset: number;
  correctionToTop: number;
}) => {
  return (
    PADDING +
    row * rowHeight +
    Math.sin(frame / 20 + column / 6) * 30 +
    entranceYOffset +
    correctionToTop
  );
};

const getExtraPaddingIfInOfLastRow = ({
  row,
  numberOfUfos,
  perRow,
  ufoContainerWidth,
  spaceInbetweenUfo,
}: {
  row: number;
  numberOfUfos: number;
  perRow: number;
  ufoContainerWidth: number;
  spaceInbetweenUfo: number;
}) => {
  const inLastRow = row === Math.floor(numberOfUfos / perRow);
  const itemsInThisRow = inLastRow ? numberOfUfos % perRow : perRow;
  const spaceInThisRow =
    itemsInThisRow * ufoContainerWidth +
    spaceInbetweenUfo * (itemsInThisRow - 1);
  return (USABLE_CANVAS_WIDTH - spaceInThisRow) / 2;
};

const makeXPosition = ({
  column,
  frame,
  i,
  spaceInbetweenUfo,
  ufoContainerWidth,
  perRow,
  numberOfUfos,
}: {
  ufoContainerWidth: number;
  column: number;
  spaceInbetweenUfo: number;
  frame: number;
  i: number;
  perRow: number;
  numberOfUfos: number;
}) => {
  const row = Math.floor(i / perRow);
  const extraPadding = getExtraPaddingIfInOfLastRow({
    perRow,
    row,
    spaceInbetweenUfo,
    numberOfUfos,
    ufoContainerWidth,
  });

  const noise = noise2D("seed", frame / 100, i) * 10;

  const ufoPosition = ufoContainerWidth * column + column * spaceInbetweenUfo;
  const ufoMiddleOffset = ufoContainerWidth / 2;

  return PADDING + ufoMiddleOffset + ufoPosition + noise + extraPadding;
};

export const makeUfoPositions = (
  numberOfUfos: number,
  closedIssues: number,
  frame: number
): UfoPosition[] => {
  const perRow = issuesPerRow(numberOfUfos);
  const spaceInbetweenUfo = 30;

  const entrace = spring({
    fps: FPS,
    frame,
    config: {
      damping: 200,
    },
  });

  const ufoContainerWidth =
    (USABLE_CANVAS_WIDTH - (perRow - 1) * spaceInbetweenUfo) / perRow;
  const ufoScale = 1 / (UFO_WIDTH / ufoContainerWidth);
  const ufoHeight = UFO_HEIGHT * ufoScale;
  const rowHeight = ufoHeight + 10;
  const rows = Math.ceil(numberOfUfos / perRow);

  const totalHeight = rows * rowHeight;

  const allUfosShouldBeAboveThisLineInitially = VIDEO_HEIGHT / 3;
  const maxCorrectionToTop = Math.min(
    0,
    allUfosShouldBeAboveThisLineInitially - totalHeight - PADDING
  );

  const entranceYOffset = interpolate(
    entrace,
    [0, 1],
    [-rows * rowHeight - 100, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const totalShootingDuration = Math.max(30, Math.min(90, numberOfUfos * 14));

  const delayBetweenAnimations = totalShootingDuration / closedIssues;

  const closedIndices = sampleUniqueIndices(numberOfUfos, closedIssues);

  const shootProgress = interpolate(
    frame,
    [TIME_BEFORE_SHOOTING, SHOOT_DURATION + totalShootingDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const correctionToTop = interpolate(
    shootProgress,
    [0, 1],
    [maxCorrectionToTop, 0]
  );

  const ufos = new Array(numberOfUfos).fill(0).map((_, i): BaseUfoPosition => {
    const row = Math.floor(i / perRow);
    const column = i % perRow;

    return {
      x: makeXPosition({
        column,
        frame,
        i,
        spaceInbetweenUfo,
        ufoContainerWidth: ufoContainerWidth,
        perRow,
        numberOfUfos: numberOfUfos,
      }),
      y: makeYPosition({
        column,
        correctionToTop,
        entranceYOffset,
        frame,
        row,
        rowHeight,
      }),
      scale: ufoScale,
    };
  });

  const sortedByDistanceFromRocket = closedIndices
    .slice()
    .sort((indexA, indexB) => {
      const a = ufos[indexA];
      const b = ufos[indexB];

      const angleA = getAngleForShoot(a.x, a.y);
      const angleB = getAngleForShoot(b.x, b.y);
      return angleA - angleB;
    });

  console.log(getShotsToFire(closedIndices, ufos));

  return ufos.map((p, i): UfoPosition => {
    return {
      ...p,
      shootDelay:
        (closedIssues - sortedByDistanceFromRocket.indexOf(i)) *
          delayBetweenAnimations +
        TIME_BEFORE_SHOOTING,
      shootDuration: SHOOT_DURATION,
      isClosed: closedIndices.includes(i),
    };
  });
};

export const rocketRotation = (positions: UfoPosition[], frame: number) => {
  const sortedByDelay = positions
    .filter((p) => p.isClosed)
    .sort((a, b) => a.shootDelay - b.shootDelay);

  const angles = sortedByDelay.map((p) => {
    const angle = getAngleForShoot(p.x, p.y);
    return { angle, delay: p.shootDelay };
  });
  if (angles.length === 0) {
    return 0;
  }

  if (angles.length === 1) {
    return angles[0].angle;
  }

  return interpolate(
    frame,
    // Looks more correct with +1
    angles.map((a) => a.delay + 1),
    angles.map((a) => a.angle),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
};

export const getAngleForShoot = (targetX: number, targetY: number) => {
  const deltaX = targetX - ROCKET_ORIGIN_X;
  const deltaY = targetY - ROCKET_ORIGIN_Y;
  let angleRadians = Math.atan2(deltaY, deltaX);
  return angleRadians;
};
