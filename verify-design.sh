#!/usr/bin/env bash
# verify-design.sh
# Simple validator to ensure styles.css values follow design.md breakpoints.
# Usage: ./verify-design.sh

set -euo pipefail

design_file=design.md
styles_file=styles.css

# Read the breakpoint set from design.md
read -r desktop tablet small_tablet mobile <<<$(grep -E "\* \*\*Desktop|\* \*\*Large tablet|\* \*\*Small tablet|\* \*\*Mobile" -A1 "$design_file" | sed -n 's/.*\([0-9]\{3,4\}\)px.*/\1/p')

# fallback expected values
expected_1440=1440
expected_1024=1024
expected_768=768
expected_425=425

# function to check breakpoint in CSS
check_bp(){
  local bp=$1
  local expected=$2
  if grep -q "@media (max-width: ${expected}px)" "$styles_file"; then
    echo "OK: breakpoint $bp uses $expected px"
  else
    echo "ERROR: breakpoint $bp not set to $expected px in $styles_file"
    exit 1
  fi
}

check_bp "desktop" "$expected_1440"
check_bp "large table" "$expected_1024"
check_bp "small tablet" "$expected_768"
check_bp "mobile" "$expected_425"

# check margin always 24px
if grep -q "\.page-shell.*padding: 0 24px" "$styles_file"; then
  echo "OK: page-shell uses 24px page margin in all breakpoints"
else
  echo "ERROR: page-shell should use 24px padding in all breakpoints"
  exit 1
fi

echo "Design validation passed."