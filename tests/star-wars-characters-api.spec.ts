import { test, expect } from "@playwright/test";

test("load first, default page", async ({ request }) => {
  const res = await request.get("/api/characters");
  expect(res.ok()).toBeTruthy();

  expect(res.status()).toBe(200);

  const data = await res.json();
  console.log(data);
  expect(data.total).toBeTruthy();
  expect(data.items?.length).toBeTruthy();
});

test("trigger validation error", async ({ request }) => {
  const res = await request.get("/api/characters?page=hello");
  expect(res.ok()).toBeFalsy();

  expect(res.status()).toBe(400);

  const text = await res.text();
  expect(text).toContain("Invalid 'page' search parameter");
});
