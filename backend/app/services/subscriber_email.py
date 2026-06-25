import asyncio
import logging
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import SITE_URL, MONGO_URL, DB_NAME
from app.services import mailgun

logger = logging.getLogger(__name__)

_SUBJECTS_WELCOME = {
    "es": "¡Gracias por suscribirte al blog de RolPlay!",
    "fr": "Merci de vous être abonné au blog RolPlay !",
    "en": "Thanks for subscribing to the RolPlay blog!",
}


def send_welcome_email(email: str, locale: str) -> None:
    try:
        subject = _SUBJECTS_WELCOME.get(locale, _SUBJECTS_WELCOME["en"])
        mailgun.send([email], subject, _welcome_html(locale))
        logger.info("Welcome email queued to=%s locale=%s", email, locale)
    except Exception:
        logger.exception("Welcome email failed for email=%s", email)


def send_new_post_emails(
    title: str,
    summary: str,
    slug: str,
    cover_image: Optional[str],
    reading_time: int,
) -> None:
    try:
        subs = _fetch_confirmed_subscribers()
        if not subs:
            logger.info("No confirmed subscribers — skipping broadcast for slug=%s", slug)
            return

        post_url = f"{SITE_URL}/blog/{slug}"
        cover_html = (
            f'<img src="{cover_image}" style="width:100%;border-radius:8px;margin-bottom:20px;" />'
            if cover_image
            else ""
        )

        for sub in subs:
            subject = _broadcast_subject(title, sub.get("locale", "en"))
            html = _broadcast_html(title, summary, reading_time, post_url, cover_html, sub)
            mailgun.send([sub["email"]], subject, html)

        logger.info("Broadcast dispatched slug=%s recipients=%d", slug, len(subs))
    except Exception:
        logger.exception("Broadcast email failed for slug=%s", slug)


# ── Private helpers ───────────────────────────────────────────────────────────

def _fetch_confirmed_subscribers() -> list[dict]:
    _c = AsyncIOMotorClient(MONGO_URL)
    _db = _c[DB_NAME]

    async def _query():
        return await _db.subscribers.find(
            {"confirmed": True}, {"email": 1, "locale": 1, "unsubscribeToken": 1}
        ).to_list(None)

    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(_query())
    finally:
        loop.close()
        _c.close()


def _broadcast_subject(title: str, locale: str) -> str:
    if locale == "es":
        return f"Nuevo en el Blog de RolPlay: {title}"
    if locale == "fr":
        return f"Nouveau sur le Blog RolPlay : {title}"
    return f"New on the RolPlay Blog: {title}"


def _broadcast_cta(locale: str) -> str:
    if locale == "es":
        return "Leer artículo →"
    if locale == "fr":
        return "Lire l'article →"
    return "Read article →"


_WELCOME_COPY = {
    "en": {
        "eyebrow":    "// Welcome",
        "headline":   "You&#39;re in.<br>Let&#39;s raise the bar.",
        "body":       "Every week we distill what&#39;s moving in AI-driven sales coaching — the techniques, the data, and the real-world results. You&#39;ll get it before anyone else.",
        "prop1_label": "What to expect",
        "prop1_title": "AI Coaching Breakdowns",
        "prop1_desc":  "Deep dives into how top commercial teams are using AI simulations to close skill gaps faster than traditional training.",
        "prop2_label": "What to expect",
        "prop2_title": "Performance Benchmarks",
        "prop2_desc":  "Curated data on conversion rates, objection handling, and ramping time — so you know where your team stands.",
        "prop3_label": "What to expect",
        "prop3_title": "Commercial Strategy",
        "prop3_desc":  "Frameworks and playbooks for pharma, financial services, and enterprise B2B — built for teams that take performance seriously.",
        "cta":         "Read the latest →",
        "cta_sub":     "New articles every week. No noise — just what moves the needle.",
        "footer_sub":  "You&#39;re receiving this because you subscribed at rolplay.ai.",
        "unsub":       "Unsubscribe",
        "tagline":     "Sales Intelligence",
    },
    "es": {
        "eyebrow":    "// Bienvenido",
        "headline":   "Ya eres parte.<br>Elevemos el nivel.",
        "body":       "Cada semana destilamos lo que está moviendo el coaching de ventas con IA — las técnicas, los datos y los resultados reales. Tú lo recibirás antes que nadie.",
        "prop1_label": "Qué esperar",
        "prop1_title": "Análisis de Coaching con IA",
        "prop1_desc":  "Exploraciones profundas sobre cómo los mejores equipos comerciales usan simulaciones de IA para cerrar brechas de habilidades más rápido que el entrenamiento tradicional.",
        "prop2_label": "Qué esperar",
        "prop2_title": "Benchmarks de Rendimiento",
        "prop2_desc":  "Datos curados sobre tasas de conversión, manejo de objeciones y tiempo de adaptación — para que sepas dónde está tu equipo.",
        "prop3_label": "Qué esperar",
        "prop3_title": "Estrategia Comercial",
        "prop3_desc":  "Frameworks y playbooks para farma, servicios financieros y B2B empresarial — diseñados para equipos que se toman el rendimiento en serio.",
        "cta":         "Leer lo último →",
        "cta_sub":     "Artículos nuevos cada semana. Sin ruido — solo lo que importa.",
        "footer_sub":  "Recibes esto porque te suscribiste en rolplay.ai.",
        "unsub":       "Cancelar suscripción",
        "tagline":     "Inteligencia Comercial",
    },
    "fr": {
        "eyebrow":    "// Bienvenue",
        "headline":   "Vous êtes des nôtres.<br>Élevons le niveau.",
        "body":       "Chaque semaine, nous distillons ce qui fait bouger le coaching commercial piloté par l&#39;IA — les techniques, les données et les résultats concrets. Vous les recevrez en avant-première.",
        "prop1_label": "Ce que vous recevrez",
        "prop1_title": "Analyses de Coaching IA",
        "prop1_desc":  "Des plongées en profondeur dans la façon dont les meilleures équipes commerciales utilisent les simulations IA pour combler les lacunes de compétences plus vite que la formation traditionnelle.",
        "prop2_label": "Ce que vous recevrez",
        "prop2_title": "Benchmarks de Performance",
        "prop2_desc":  "Données sélectionnées sur les taux de conversion, la gestion des objections et le temps de montée en compétence — pour savoir où se situe votre équipe.",
        "prop3_label": "Ce que vous recevrez",
        "prop3_title": "Stratégie Commerciale",
        "prop3_desc":  "Frameworks et playbooks pour la pharma, les services financiers et le B2B entreprise — conçus pour des équipes qui prennent la performance au sérieux.",
        "cta":         "Lire les derniers articles →",
        "cta_sub":     "De nouveaux articles chaque semaine. Sans bruit — juste l&#39;essentiel.",
        "footer_sub":  "Vous recevez ceci parce que vous vous êtes abonné sur rolplay.ai.",
        "unsub":       "Se désabonner",
        "tagline":     "Intelligence Commerciale",
    },
}


def _welcome_html(locale: str) -> str:
    c = _WELCOME_COPY.get(locale, _WELCOME_COPY["en"])
    rail = "width:2px;min-height:44px;background:#C0392B;border-radius:2px;flex-shrink:0;margin-top:3px;opacity:0.7;"
    return f"""<!DOCTYPE html>
<html lang="{locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#06060A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#06060A;padding:40px 16px 60px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- top red bar -->
  <tr><td style="background:#C0392B;height:3px;border-radius:4px 4px 0 0;line-height:3px;font-size:3px;">&nbsp;</td></tr>

  <!-- header -->
  <tr><td style="background:#111115;padding:28px 40px 24px;border-left:1px solid #222228;border-right:1px solid #222228;border-bottom:1px solid #1E1E24;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:18px;font-weight:700;letter-spacing:-0.02em;color:#FAFAFA;">
        <span style="color:#C0392B;">Rol</span>Play
      </td>
      <td align="right" style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#52525B;">
        {c["tagline"]}
      </td>
    </tr></table>
  </td></tr>

  <!-- hero -->
  <tr><td style="background:#111115;padding:44px 40px 36px;border-left:1px solid #222228;border-right:1px solid #222228;border-bottom:1px solid #1A1A20;">
    <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#C0392B;font-weight:600;">{c["eyebrow"]}</p>
    <h1 style="margin:0 0 18px;font-size:34px;font-weight:700;color:#FAFAFA;letter-spacing:-0.03em;line-height:1.1;">{c["headline"]}</h1>
    <p style="margin:0;font-size:15px;line-height:1.7;color:#A1A1AA;max-width:460px;">{c["body"]}</p>
  </td></tr>

  <!-- prop 1 -->
  <tr><td style="background:#111115;padding:24px 40px;border-left:1px solid #222228;border-right:1px solid #222228;border-bottom:1px solid #1A1A20;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="{rail}">&nbsp;</td>
      <td style="padding-left:20px;">
        <p style="margin:0 0 5px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#52525B;font-weight:600;">{c["prop1_label"]}</p>
        <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#E4E4E7;letter-spacing:-0.01em;">{c["prop1_title"]}</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#71717A;">{c["prop1_desc"]}</p>
      </td>
    </tr></table>
  </td></tr>

  <!-- prop 2 -->
  <tr><td style="background:#111115;padding:24px 40px;border-left:1px solid #222228;border-right:1px solid #222228;border-bottom:1px solid #1A1A20;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="{rail}">&nbsp;</td>
      <td style="padding-left:20px;">
        <p style="margin:0 0 5px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#52525B;font-weight:600;">{c["prop2_label"]}</p>
        <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#E4E4E7;letter-spacing:-0.01em;">{c["prop2_title"]}</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#71717A;">{c["prop2_desc"]}</p>
      </td>
    </tr></table>
  </td></tr>

  <!-- prop 3 -->
  <tr><td style="background:#111115;padding:24px 40px;border-left:1px solid #222228;border-right:1px solid #222228;border-bottom:1px solid #1A1A20;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="{rail}">&nbsp;</td>
      <td style="padding-left:20px;">
        <p style="margin:0 0 5px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#52525B;font-weight:600;">{c["prop3_label"]}</p>
        <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#E4E4E7;letter-spacing:-0.01em;">{c["prop3_title"]}</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#71717A;">{c["prop3_desc"]}</p>
      </td>
    </tr></table>
  </td></tr>

  <!-- cta -->
  <tr><td style="background:#111115;padding:36px 40px;border-left:1px solid #222228;border-right:1px solid #222228;border-bottom:1px solid #1A1A20;">
    <a href="{SITE_URL}/blog" style="display:inline-block;background:#C0392B;color:#FAFAFA;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.04em;padding:13px 28px;border-radius:3px;text-transform:uppercase;">{c["cta"]}</a>
    <p style="margin:14px 0 0;font-size:12px;color:#52525B;line-height:1.5;">{c["cta_sub"]}</p>
  </td></tr>

  <!-- footer -->
  <tr><td style="background:#0D0D11;padding:24px 40px;border:1px solid #222228;border-top:none;border-radius:0 0 4px 4px;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#3F3F46;">
      <span style="color:#5A1A13;">Rol</span>Play · rolplay.ai
    </p>
    <p style="margin:0;font-size:11px;color:#3F3F46;letter-spacing:0.02em;">
      {c["footer_sub"]} &nbsp;·&nbsp;
      <a href="{SITE_URL}/unsubscribe" style="color:#52525B;">{c["unsub"]}</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>"""


def _broadcast_html(
    title: str,
    summary: str,
    reading_time: int,
    post_url: str,
    cover_html: str,
    sub: dict,
) -> str:
    locale = sub.get("locale", "en")
    unsub_url = f"{post_url}?unsubscribe={sub.get('unsubscribeToken', '')}"
    return f"""
<div style="background:#0A0A0E;padding:40px 20px;font-family:sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#111115;border:1px solid #222;border-radius:12px;padding:40px;">
    <h1 style="color:#fff;margin:0 0 20px;font-size:13px;letter-spacing:.15em;text-transform:uppercase;">
      <span style="color:#C0392B;">Rol</span>Play
    </h1>
    {cover_html}
    <p style="color:#C0392B;font-size:11px;letter-spacing:.15em;text-transform:uppercase;margin:0 0 8px;">New Post</p>
    <h2 style="color:#fff;margin:0 0 12px;font-size:22px;line-height:1.3;">{title}</h2>
    <p style="color:#A1A1AA;font-size:13px;margin:0 0 20px;">{reading_time} min read</p>
    <p style="color:#A1A1AA;margin:0 0 28px;line-height:1.6;">{summary}</p>
    <a href="{post_url}" style="display:inline-block;background:#C0392B;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;">
      {_broadcast_cta(locale)}
    </a>
    <p style="color:#52525B;font-size:11px;margin:32px 0 0;">
      <a href="{unsub_url}" style="color:#52525B;">Unsubscribe</a>
    </p>
  </div>
</div>
"""
