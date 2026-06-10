"""Locust load test for the public read paths.

Usage:
    pip install locust
    locust -f deploy/locustfile.py --host=https://itmgoi.in -u 200 -r 20 -t 2m --headless

Goal: hold p95 < 500 ms on the entire bundle with 200 concurrent VUs.
"""
from __future__ import annotations

import random
from locust import HttpUser, between, task


CATEGORIES = ["cultural", "experts", "infrastructure", "sports", "students", "life", "videos"]
DEPT_CODES = ["CSE", "IT", "ECE", "CE", "ME", "MBA", "ESH"]


class PublicReader(HttpUser):
    wait_time = between(1, 4)

    @task(5)
    def home(self):
        self.client.get("/api/public/home", name="/public/home")

    @task(3)
    def settings(self):
        self.client.get("/api/public/settings", name="/public/settings")

    @task(4)
    def department(self):
        code = random.choice(DEPT_CODES)
        self.client.get(f"/api/public/department/{code}", name="/public/department/{code}")

    @task(2)
    def recruiters(self):
        self.client.get("/api/public/recruiters", name="/public/recruiters")

    @task(2)
    def tap(self):
        self.client.get("/api/public/tap", name="/public/tap")

    @task(2)
    def events(self):
        self.client.get("/api/public/events?status=upcoming&limit=6", name="/public/events")

    @task(2)
    def notices(self):
        self.client.get("/api/public/notices", name="/public/notices")

    @task(2)
    def gallery(self):
        self.client.get("/api/public/gallery", name="/public/gallery")

    @task(1)
    def gallery_category(self):
        slug = random.choice(CATEGORIES)
        self.client.get(f"/api/public/gallery/{slug}", name="/public/gallery/{slug}")

    @task(1)
    def admissions(self):
        self.client.get("/api/public/admissions", name="/public/admissions")

    @task(1)
    def naac(self):
        self.client.get("/api/public/compliance/naac", name="/public/compliance/naac")

    @task(1)
    def nirf(self):
        self.client.get("/api/public/compliance/nirf", name="/public/compliance/nirf")

    @task(1)
    def alumni(self):
        self.client.get("/api/public/alumni/speaks", name="/public/alumni/speaks")

    @task(1)
    def sitemap(self):
        self.client.get("/api/public/sitemap.xml", name="/public/sitemap.xml")
