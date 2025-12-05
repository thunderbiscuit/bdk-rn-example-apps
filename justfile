[group("Repo")]
[doc("Default command; list all available commands.")]
@list:
  just --list --unsorted

[group("Repo")]
[doc("Open repo on GitHub in your default browser.")]
repo:
  open https://github.com/thunderbiscuit/bdk-rn-example-apps/

[group("Build")]
[doc("Clean all build artifacts and caches")]
clean:
  @echo "Cleaning iOS build artifacts..."
  rm -rf ios/build
  rm -rf ios/Pods
  rm -rf ios/Podfile.lock
  @echo "\nCleaning Android build artifacts..."
  rm -rf android/build/
  rm -rf android/.gradle/
  rm -rf android/app/.cxx/
  rm -rf android/app/build/
  @echo "\nCleaning npm cache..."
  rm -rf node_modules
  rm -rf package-lock.json
  @echo "\nAll caches cleared!"
