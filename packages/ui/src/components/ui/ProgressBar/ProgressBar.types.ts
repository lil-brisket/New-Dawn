export interface ProgressBarProps {
  value: number;
  max: number;
  animated?: boolean;
  color?: string;
  backgroundColor?: string;
  height?: number;
  label?: string;
  testID?: string;
  accessibilityLabel?: string;
}
