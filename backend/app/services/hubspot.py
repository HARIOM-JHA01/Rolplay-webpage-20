import logging
import requests
from app.config import HUBSPOT_ACCESS_TOKEN

logger = logging.getLogger(__name__)


def push_contact(name: str, email: str, company: str, message: str) -> None:
    if not HUBSPOT_ACCESS_TOKEN:
        logger.warning("HUBSPOT_ACCESS_TOKEN not set — skipping HubSpot sync for email=%s", email)
        return

    first, *rest = name.strip().split(" ", 1)
    last = rest[0] if rest else ""

    properties = {
        "email": email,
        "firstname": first,
        "lastname": last,
        "company": company or "",
        "message": message,
        "hs_lead_status": "NEW",
    }
    headers = {"Authorization": f"Bearer {HUBSPOT_ACCESS_TOKEN}", "Content-Type": "application/json"}

    resp = requests.post(
        "https://api.hubapi.com/crm/v3/objects/contacts",
        headers=headers,
        json={"properties": properties},
        timeout=10,
    )

    if resp.status_code == 409:
        logger.info("HubSpot contact already exists for email=%s — attempting update", email)
        _update_existing(email, properties, headers)
    elif resp.ok:
        logger.info("HubSpot contact created for email=%s", email)
    else:
        logger.error("HubSpot contact push failed email=%s status=%s body=%s", email, resp.status_code, resp.text)


def _update_existing(email: str, properties: dict, headers: dict) -> None:
    lookup = requests.get(
        f"https://api.hubapi.com/crm/v3/objects/contacts/{email}?idProperty=email",
        headers=headers,
        timeout=10,
    )
    if not lookup.ok:
        logger.error("HubSpot contact lookup failed for email=%s status=%s", email, lookup.status_code)
        return

    contact_id = lookup.json().get("id")
    if not contact_id:
        logger.error("HubSpot contact lookup returned no id for email=%s", email)
        return

    patch = requests.patch(
        f"https://api.hubapi.com/crm/v3/objects/contacts/{contact_id}",
        headers=headers,
        json={"properties": {k: v for k, v in properties.items() if k != "email"}},
        timeout=10,
    )
    if patch.ok:
        logger.info("HubSpot contact updated id=%s email=%s", contact_id, email)
    else:
        logger.error("HubSpot contact update failed id=%s status=%s body=%s", contact_id, patch.status_code, patch.text)
