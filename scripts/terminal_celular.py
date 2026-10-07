# Versão vertical do terminal, para telas pequenas: logo em cima, cartão embaixo,
# letra maior. O README escolhe esta pelo <picture> quando a tela é estreita.
# uso: python3 terminal_celular.py ICONE.png PASTA_SAIDA
import importlib.util
import sys
from html import escape

ICONE, SAIDA = sys.argv[1], sys.argv[2]
spec = importlib.util.spec_from_file_location("terminal", __file__.replace("terminal_celular.py", "terminal.py"))
sys.argv = [sys.argv[0], ICONE, "/dev/null/nao-grava"]
base = importlib.util.module_from_spec(spec)
try:
    spec.loader.exec_module(base)  # só para reaproveitar o logo e os temas
except (FileNotFoundError, NotADirectoryError):
    pass
logo, TEMAS, PALETA, FONTE = base.logo, base.TEMAS, base.PALETA, base.FONTE

CARTAO = [
    ("Projeto", "MestrIA"),
    ("IA", "foto → resumo, flashcards, quiz"),
    ("Solana", "meta vira compromisso"),
    ("Rede", "Devnet · Anchor · Privy"),
    ("Stack", "React · Supabase · Vercel"),
    ("No ar", "desde agosto de 2026"),
    ("Feito", "no Brasil"),
    ("Status", "construindo em público"),
    ("App", "vagalume.xyz/app"),
]
LARG, PAD, TOPO = 500, 22, 40
FS_LOGO, LH_LOGO = 11.5, 13.5
FS, LH = 17, 27


def svg(tema):
    t = TEMAS[tema]
    y_cmd = TOPO + 32
    y_logo = y_cmd + 30
    larg_logo = 0.6 * FS_LOGO * max(len(l) for l in logo)
    x_logo = (LARG - larg_logo) / 2
    y_info = y_logo + LH_LOGO * len(logo) + 34
    linhas = [("titulo", "thulio@mestria"), ("traco", "─" * 14)] + [("par", k, v) for k, v in CARTAO]
    y_pal = y_info + LH * (len(linhas) + 0.4)
    y_cur = y_pal + LH + 10
    ALT = int(y_cur + 22)
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{LARG}" height="{ALT}" viewBox="0 0 {LARG} {ALT}" role="img" '
         f'aria-label="thulio@mestria: fundador da MestrIA, app de estudo com IA e compromisso de estudo na Solana">',
         f'<defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{t["g1"]}"/>'
         f'<stop offset="1" stop-color="{t["g2"]}"/></linearGradient>'
         f'<clipPath id="digita"><rect x="{PAD}" y="{y_cmd - 20}" width="0" height="28">'
         f'<animate attributeName="width" from="0" to="320" begin="0.3s" dur="0.9s" fill="freeze"/></rect></clipPath>{base.HALO_SOLTO}</defs>',
         f'<rect x="1" y="1" width="{LARG - 2}" height="{ALT - 2}" rx="14" fill="{t["fundo"]}" stroke="{t["borda"]}" stroke-width="2"/>',
         f'<path d="M1 15a14 14 0 0 1 14-14h{LARG - 30}a14 14 0 0 1 14 14v{TOPO - 15}H1z" fill="{t["barra"]}"/>',
         f'<line x1="1" y1="{TOPO}" x2="{LARG - 1}" y2="{TOPO}" stroke="{t["borda"]}" stroke-width="1.5"/>']
    for i, cor in enumerate(["#ff5f57", "#febc2e", "#28c840"]):
        p.append(f'<circle cx="{22 + i * 20}" cy="{TOPO / 2}" r="6" fill="{cor}"/>')
    p.append(f'<g clip-path="url(#digita)"><text x="{PAD}" y="{y_cmd}" font-family="{FONTE}" font-size="{FS}" fill="{t["texto"]}">'
             f'<tspan fill="{t["prompt"]}" font-weight="700">thulio@mestria</tspan><tspan fill="{t["mudo"]}">:~$</tspan> neofetch</text></g>')
    inicio = 1.4
    for i, linha in enumerate(logo):
        p.append(f'<text x="{x_logo:.1f}" y="{y_logo + i * LH_LOGO:.1f}" font-family="{FONTE}" font-size="{FS_LOGO}" fill="url(#grad)" xml:space="preserve" opacity="0">'
                 f'{escape(linha)}<animate attributeName="opacity" from="0" to="1" begin="{inicio + i * 0.06:.2f}s" dur="0.08s" fill="freeze"/></text>')
    t0 = inicio + len(logo) * 0.06 + 0.1
    for i, item in enumerate(linhas):
        y = y_info + i * LH
        anim = f'<animate attributeName="opacity" from="0" to="1" begin="{t0 + i * 0.18:.2f}s" dur="0.25s" fill="freeze"/>'
        if item[0] == "titulo":
            p.append(f'<text x="{PAD}" y="{y}" font-family="{FONTE}" font-size="{FS + 1}" font-weight="700" fill="{t["chave"]}" opacity="0">{item[1]}{anim}</text>')
        elif item[0] == "traco":
            p.append(f'<text x="{PAD}" y="{y}" font-family="{FONTE}" font-size="{FS}" fill="{t["mudo"]}" opacity="0">{item[1]}{anim}</text>')
        else:
            p.append(f'<text x="{PAD}" y="{y}" font-family="{FONTE}" font-size="{FS}" xml:space="preserve" opacity="0">'
                     f'<tspan fill="{t["chave"]}" font-weight="700">{escape(item[1])}</tspan><tspan fill="{t["texto"]}" x="{PAD + 0.6 * FS * 9}">{escape(item[2])}</tspan>{anim}</text>')
    tp = t0 + len(linhas) * 0.18 + 0.1
    for i, cor in enumerate(PALETA):
        p.append(f'<rect x="{PAD + i * 32}" y="{y_pal - 16}" width="28" height="20" rx="3" fill="{cor}" opacity="0">'
                 f'<animate attributeName="opacity" from="0" to="1" begin="{tp + i * 0.05:.2f}s" dur="0.2s" fill="freeze"/></rect>')
    if tema == "escuro":
        p.extend(base.soltos(x_logo - 20, x_logo + larg_logo + 20, y_logo - 20, y_logo + LH_LOGO * len(logo), 5, t0, 11))
    tc = tp + len(PALETA) * 0.05 + 0.3
    p.append(f'<text x="{PAD}" y="{y_cur}" font-family="{FONTE}" font-size="{FS}" opacity="0">'
             f'<tspan fill="{t["prompt"]}" font-weight="700">thulio@mestria</tspan><tspan fill="{t["mudo"]}">:~$</tspan>'
             f'<animate attributeName="opacity" from="0" to="1" begin="{tc:.2f}s" dur="0.1s" fill="freeze"/></text>')
    p.append(f'<rect x="{PAD + 0.6 * FS * 19:.1f}" y="{y_cur - 15}" width="10" height="20" fill="{t["texto"]}" opacity="0">'
             f'<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.01;0.5;0.51;1" dur="1.1s" begin="{tc:.2f}s" repeatCount="indefinite"/></rect>')
    p.append("</svg>")
    return "\n".join(p), ALT


for tema in TEMAS:
    doc, alt = svg(tema)
    open(f"{SAIDA}/terminal-celular-{tema}.svg", "w", encoding="utf-8").write(doc)
    print(tema, LARG, "x", alt)
