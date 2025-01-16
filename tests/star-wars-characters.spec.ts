import { test, expect } from "@playwright/test";

test("loads initial page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Luke Skywalker")).toBeVisible();

  await expect(page.getByText("Prev")).toBeDisabled();
  await expect(page.getByText("Next")).toBeEnabled();
});

test("go to second page", async ({ page }) => {
  await page.goto("/");

  const nextButton = page.getByText("Next");
  await expect(nextButton).toBeEnabled();
  await nextButton.click();
  await expect(page.getByText("Palpatine")).toBeVisible();
});
