from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:5173")

    # Sign up a new user
    signup_form = page.locator('form:has-text("Sign Up")')
    signup_form.get_by_placeholder("Username").fill("testuser")
    signup_form.get_by_placeholder("Email").fill("testuser@example.com")
    signup_form.get_by_placeholder("Password").fill("password")
    signup_form.get_by_role("button", name="Sign Up").click()

    # Wait for the signup to complete by looking for the alert text.
    # We can't interact with the alert directly, but we can check for its effect.
    # In this case, the app doesn't give a visual cue, so we'll just wait a bit.
    page.wait_for_timeout(2000)

    # Target the login form specifically and fill it out
    login_form = page.locator('form:has-text("Login")')
    login_form.get_by_placeholder("Email").fill("testuser@example.com")
    login_form.get_by_placeholder("Password").fill("password")
    login_form.get_by_role("button", name="Login").click()

    # Wait for the main content to load after login
    expect(page.get_by_placeholder("What's on your mind?")).to_be_visible()

    # Create a new post
    page.get_by_placeholder("What's on your mind?").fill("Hello from Playwright!")
    page.get_by_role("button", name="Post").click()

    # Wait for the post to appear in the feed
    expect(page.locator("text=Hello from Playwright!")).to_be_visible()

    # Take the final screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
