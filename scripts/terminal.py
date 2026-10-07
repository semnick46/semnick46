# Gera o terminal animado do perfil (estilo neofetch): o logo da MestrIA em
# caracteres à esquerda e o cartão à direita. Animação em SMIL, que o GitHub
# mantém quando mostra o SVG como imagem (CSS externo e JavaScript são barrados).
# uso: python3 terminal.py ICONE.png PASTA_SAIDA
import random
import sys
from html import escape

import numpy as np
from PIL import Image

ICONE, SAIDA = sys.argv[1], sys.argv[2]
COLS, ROWS = 38, 19
RAMPA = "=+*#%@"

a = np.asarray(Image.open(ICONE).convert("RGBA")).astype(float) / 255
H, W = a.shape[:2]
logo = []
for r in range(ROWS):
    linha = ""
    for c in range(COLS):
        cel = a[int(r * H / ROWS):int((r + 1) * H / ROWS), int(c * W / COLS):int((c + 1) * W / COLS)]
        alfa = cel[..., 3].mean()
        lum = (0.2126 * cel[..., 0] + 0.7152 * cel[..., 1] + 0.0722 * cel[..., 2]).mean()
        if alfa < 0.55 or lum < 0.47:
            linha += " "
        else:
            linha += RAMPA[min(len(RAMPA) - 1, int((lum - 0.47) / 0.53 * len(RAMPA)))]
    logo.append(linha.rstrip())
while logo and not logo[0].strip():
    logo.pop(0)
while logo and not logo[-1].strip():
    logo.pop()

CARTAO = [
    ("Projeto", "MestrIA"),
    ("IA", "foto da matéria → resumo, flashcards e quiz"),
    ("Solana", "a meta de estudo vira compromisso"),
    ("Rede", "Devnet · Anchor · Privy · cNFT"),
    ("Stack", "React · Vite · Supabase · Vercel"),
    ("No ar", "desde agosto de 2026"),
    ("Feito", "no Brasil"),
    ("Status", "construindo sozinho, em público"),
    ("App", "vagalume.xyz/app"),
]

TEMAS = {
    "escuro": dict(fundo="#070b12", borda="#223047", barra="#0e1623", texto="#e6edf3", chave="#83f28f",
                   mudo="#8b949e", g1="#83f28f", g2="#69a7ff", prompt="#83f28f"),
    "claro": dict(fundo="#ffffff", borda="#d0d7de", barra="#f6f8fa", texto="#1f2328", chave="#1a7f37",
                  mudo="#59636e", g1="#1a7f37", g2="#0969da", prompt="#1a7f37"),
}
PALETA = ["#ff7b72", "#ffa657", "#f4ff3a", "#83f28f", "#5fd6a4", "#69a7ff", "#bc8cff", "#e6edf3"]

# brilho dos vagalumes soltos (mesmo desenho do mapa de contribuições)
HALO_SOLTO = ('<radialGradient id="hs"><stop offset="0" stop-color="#f4ff3a" stop-opacity="0.75"/>'
              '<stop offset="1" stop-color="#b6ff7a" stop-opacity="0"/></radialGradient>')


def soltos(x0, x1, y0, y1, n, inicio, semente):
    """Vagalumes voando devagar numa área, piscando. Só no tema escuro."""
    rnd, out = random.Random(semente), []
    for _ in range(n):
        pts = [(rnd.uniform(x0, x1), rnd.uniform(y0, y1)) for _ in range(4)]
        d = f"M{pts[0][0]:.0f} {pts[0][1]:.0f}"
        for a, b in zip(pts, pts[1:] + pts[:1]):
            d += f" Q{(a[0] + b[0]) / 2 + rnd.uniform(-30, 30):.0f} {(a[1] + b[1]) / 2 + rnd.uniform(-20, 20):.0f} {b[0]:.0f} {b[1]:.0f}"
        beg = inicio + rnd.uniform(0, 3)
        out.append(f'<g opacity="0"><circle r="11" fill="url(#hs)"/><circle r="2.1" fill="#f6ffb0"/>'
                   f'<animateMotion path="{d}" dur="{rnd.uniform(16, 26):.1f}s" begin="{beg:.2f}s" repeatCount="indefinite"/>'
                   f'<animate attributeName="opacity" values="0;0.95;0.25;0.85;0" dur="{rnd.uniform(5, 8):.1f}s" begin="{beg:.2f}s" repeatCount="indefinite"/></g>')
    return out


FONTE = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"
LARG, PAD, TOPO = 900, 28, 44
FS_LOGO, LH_LOGO = 13, 15.5
FS, LH = 15, 24
X_INFO = PAD + 24 + 0.6 * FS_LOGO * COLS + 30
Y0 = TOPO + 30


def svg(tema):
    t = TEMAS[tema]
    y_info0 = Y0 + 34
    altura_info = y_info0 + LH * (len(CARTAO) + 3) + 26
    altura_logo = Y0 + 34 + LH_LOGO * len(logo) + 20
    ALT = int(max(altura_info, altura_logo) + 10)
    p = []
    p.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{LARG}" height="{ALT}" viewBox="0 0 {LARG} {ALT}" role="img" '
             f'aria-label="thulio@mestria: fundador da MestrIA, app de estudo com IA e compromisso de estudo na Solana">')
    p.append(f'<defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{t["g1"]}"/>'
             f'<stop offset="1" stop-color="{t["g2"]}"/></linearGradient>'
             f'<clipPath id="digita"><rect x="{PAD + 10}" y="{Y0 - 18}" width="0" height="26">'
             f'<animate attributeName="width" from="0" to="300" begin="0.3s" dur="0.9s" fill="freeze"/></rect></clipPath>{HALO_SOLTO}</defs>')
    # janela
    p.append(f'<rect x="1" y="1" width="{LARG - 2}" height="{ALT - 2}" rx="14" fill="{t["fundo"]}" stroke="{t["borda"]}" stroke-width="2"/>')
    p.append(f'<path d="M1 15a14 14 0 0 1 14-14h{LARG - 30}a14 14 0 0 1 14 14v{TOPO - 15}H1z" fill="{t["barra"]}"/>')
    p.append(f'<line x1="1" y1="{TOPO}" x2="{LARG - 1}" y2="{TOPO}" stroke="{t["borda"]}" stroke-width="1.5"/>')
    for i, cor in enumerate(["#ff5f57", "#febc2e", "#28c840"]):
        p.append(f'<circle cx="{24 + i * 22}" cy="{TOPO / 2}" r="6.5" fill="{cor}"/>')
    p.append(f'<text x="{LARG / 2}" y="{TOPO / 2 + 5}" text-anchor="middle" font-family="{FONTE}" font-size="13" fill="{t["mudo"]}">thulio@mestria — zsh</text>')
    # comando digitado
    p.append(f'<g clip-path="url(#digita)"><text x="{PAD + 10}" y="{Y0}" font-family="{FONTE}" font-size="{FS}" fill="{t["texto"]}">'
             f'<tspan fill="{t["prompt"]}" font-weight="700">thulio@mestria</tspan><tspan fill="{t["mudo"]}">:~$</tspan> neofetch</text></g>')
    # logo linha a linha
    inicio = 1.4
    for i, linha in enumerate(logo):
        y = Y0 + 34 + i * LH_LOGO
        p.append(f'<text x="{PAD + 14}" y="{y:.1f}" font-family="{FONTE}" font-size="{FS_LOGO}" fill="url(#grad)" xml:space="preserve" opacity="0">'
                 f'{escape(linha)}<animate attributeName="opacity" from="0" to="1" begin="{inicio + i * 0.06:.2f}s" dur="0.08s" fill="freeze"/></text>')
    # cartão linha a linha
    t0 = inicio + len(logo) * 0.06 + 0.1
    linhas = [("titulo", "thulio@mestria"), ("traco", "─" * 14)] + [("par", k, v) for k, v in CARTAO]
    for i, item in enumerate(linhas):
        y = y_info0 + i * LH
        anim = f'<animate attributeName="opacity" from="0" to="1" begin="{t0 + i * 0.18:.2f}s" dur="0.25s" fill="freeze"/>'
        if item[0] == "titulo":
            p.append(f'<text x="{X_INFO}" y="{y}" font-family="{FONTE}" font-size="{FS + 1}" font-weight="700" fill="{t["chave"]}" opacity="0">{item[1]}{anim}</text>')
        elif item[0] == "traco":
            p.append(f'<text x="{X_INFO}" y="{y}" font-family="{FONTE}" font-size="{FS}" fill="{t["mudo"]}" opacity="0">{item[1]}{anim}</text>')
        else:
            k, v = item[1], item[2]
            p.append(f'<text x="{X_INFO}" y="{y}" font-family="{FONTE}" font-size="{FS}" xml:space="preserve" opacity="0">'
                     f'<tspan fill="{t["chave"]}" font-weight="700">{escape(k)}</tspan><tspan fill="{t["texto"]}" x="{X_INFO + 0.6 * FS * 9}">{escape(v)}</tspan>{anim}</text>')
    # paleta de cores, como no neofetch
    tp = t0 + len(linhas) * 0.18 + 0.1
    yp = y_info0 + (len(linhas) + 0.6) * LH
    for i, cor in enumerate(PALETA):
        p.append(f'<rect x="{X_INFO + i * 30}" y="{yp - 14}" width="26" height="18" rx="3" fill="{cor}" opacity="0">'
                 f'<animate attributeName="opacity" from="0" to="1" begin="{tp + i * 0.05:.2f}s" dur="0.2s" fill="freeze"/></rect>')
    # vagalumes soltos em volta do logo
    if tema == "escuro":
        p.extend(soltos(PAD, PAD + 24 + 0.6 * FS_LOGO * COLS, Y0 + 20, Y0 + 34 + LH_LOGO * len(logo), 6, t0, 7))
    # cursor piscando no fim
    tc = tp + len(PALETA) * 0.05 + 0.3
    yc = yp + LH + 4
    p.append(f'<text x="{PAD + 10}" y="{yc}" font-family="{FONTE}" font-size="{FS}" opacity="0">'
             f'<tspan fill="{t["prompt"]}" font-weight="700">thulio@mestria</tspan><tspan fill="{t["mudo"]}">:~$</tspan>'
             f'<animate attributeName="opacity" from="0" to="1" begin="{tc:.2f}s" dur="0.1s" fill="freeze"/></text>')
    xc = PAD + 10 + 0.6 * FS * 19
    p.append(f'<rect x="{xc:.1f}" y="{yc - 14}" width="9" height="18" fill="{t["texto"]}" opacity="0">'
             f'<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.01;0.5;0.51;1" dur="1.1s" begin="{tc:.2f}s" repeatCount="indefinite"/></rect>')
    p.append("</svg>")
    return "\n".join(p), ALT


for tema in TEMAS:
    doc, alt = svg(tema)
    open(f"{SAIDA}/terminal-{tema}.svg", "w", encoding="utf-8").write(doc)
    print(tema, alt, "px de altura,", len(doc), "bytes")
print("\n".join(logo))
