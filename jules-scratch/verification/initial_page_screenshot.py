from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:5173")
    page.wait_for_load_state()
    page.screenshot(path="jules-scratch/verification/initial_page.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
