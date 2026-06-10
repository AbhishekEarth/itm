from __future__ import annotations


def test_public_department_returns_full_payload(client):
    r = client.get("/api/public/department/CSE")
    assert r.status_code == 200
    body = r.json()
    assert body["code"] == "CSE"
    assert body["hod"]["name"] == "Dr. HoD CSE"
    assert body["mission"] == ["m1", "m2"]
    assert body["labs"][0]["name"] == "Test Lab"
    assert body["facultyHighlights"][0]["name"] == "Dr. Alpha"
    assert body["meta"]["title"].startswith("Computer")


def test_public_departments_list(client):
    r = client.get("/api/public/departments")
    assert r.status_code == 200
    codes = {d["code"] for d in r.json()}
    assert {"CSE", "ECE"} <= codes


def test_cs_editor_can_edit_cs_dept(client, cs_editor_token, auth_headers):
    r = client.patch(
        "/api/departments/CSE",
        headers=auth_headers(cs_editor_token),
        json={"intro_md": "Updated by CS editor"},
    )
    assert r.status_code == 200
    assert r.json()["intro_md"] == "Updated by CS editor"


def test_cs_editor_cannot_edit_ece(client, cs_editor_token, auth_headers):
    r = client.patch(
        "/api/departments/ECE",
        headers=auth_headers(cs_editor_token),
        json={"intro_md": "Hijack attempt"},
    )
    assert r.status_code == 403


def test_placement_editor_cannot_edit_any_dept(client, placement_editor_token, auth_headers):
    r = client.patch(
        "/api/departments/CSE",
        headers=auth_headers(placement_editor_token),
        json={"intro_md": "x"},
    )
    assert r.status_code == 403


def test_cs_editor_can_add_lab_in_cs_only(client, cs_editor_token, auth_headers):
    r = client.post(
        "/api/departments/CSE/labs",
        headers=auth_headers(cs_editor_token),
        json={"name": "New Cloud Lab", "icon": "☁️", "description": "AWS-grade"},
    )
    assert r.status_code == 201
    lab_id = r.json()["id"]

    # cannot add lab to ECE
    r2 = client.post(
        "/api/departments/ECE/labs",
        headers=auth_headers(cs_editor_token),
        json={"name": "Hijacked", "icon": "x"},
    )
    assert r2.status_code == 403

    # public endpoint immediately reflects the new lab
    pub = client.get("/api/public/department/CSE").json()
    assert any(l["name"] == "New Cloud Lab" for l in pub["labs"])

    # CS editor can edit/delete their own lab
    upd = client.patch(
        f"/api/departments/CSE/labs/{lab_id}",
        headers=auth_headers(cs_editor_token),
        json={"name": "Renamed Cloud Lab", "icon": "☁️"},
    )
    assert upd.status_code == 200
    del_ = client.delete(f"/api/departments/CSE/labs/{lab_id}", headers=auth_headers(cs_editor_token))
    assert del_.status_code == 204


def test_cs_editor_can_upsert_hod(client, cs_editor_token, auth_headers):
    r = client.put(
        "/api/departments/CSE/hod",
        headers=auth_headers(cs_editor_token),
        json={"name": "Dr. New HoD", "message_md": "Hello world"},
    )
    assert r.status_code == 200
    pub = client.get("/api/public/department/CSE").json()
    assert pub["hod"]["name"] == "Dr. New HoD"


def test_super_admin_can_add_faculty_to_any_dept(client, admin_token, auth_headers):
    r = client.post(
        "/api/departments/ECE/faculty",
        headers=auth_headers(admin_token),
        json={"name": "Dr. Sigma", "role": "Asst. Professor", "is_highlight": True},
    )
    assert r.status_code == 201
    pub = client.get("/api/public/department/ECE").json()
    assert any(f["name"] == "Dr. Sigma" for f in pub["facultyHighlights"])
