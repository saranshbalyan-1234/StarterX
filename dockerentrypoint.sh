#!/bin/bash
# Remove Chromium Singleton files
rm -rf ~/.config/chromium/Singleton*
rm -rf ~/.config/chromium/SingletonLock*
rm -rf ~/.config/chromium/Singleton
rm -rf ~/.config/chromium/SingletonLock

rm -rf ~/.config/google-chrome/Singleton*
rm -rf ~/.config/google-chrome/SingletonLock*
rm -rf ~/.config/google-chrome/Singleton
rm -rf ~/.config/google-chrome/SingletonLock

rm -rf ~/.config/chromium*
rm -rf ~/.config/google-chrome*
rm -rf ~/.config/chromium
rm -rf ~/.config/google-chrome


# Start the application (npm start)
pkill chrome
pkill chromium
exec npm start
