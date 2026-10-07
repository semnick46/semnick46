#!/usr/bin/env python3
# Mapa de contribuições do perfil no estilo "vagalumes": cada dia com código
# acende uma luz e os dias mais fortes ficam piscando. O GitHub Actions roda
# este arquivo todo dia (.github/workflows/vagalumes.yml) e publica os SVGs na
# branch output, para o histórico da main não encher de commit automático.
# Só usa a biblioteca padrão do Python: nada para instalar e nenhum serviço de
# terceiros no meio. A animação é SMIL, que o GitHub mantém quando mostra o SVG
# como imagem (CSS externo e JavaScript são barrados).
#
# uso: python3 vagalumes.py --usuario semnick46 --saida PASTA [--dados dias.json]
import argparse
import datetime as dt
import json
import os
import random
import re
import sys
import urllib.request
from html import escape

MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
MESES_EXT = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto",
             "setembro", "outubro", "novembro", "dezembro"]
FONTE = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"

# Mesmas cores do terminal do perfil. No escuro, o fundo é o azul-noite da
# MestrIA e as luzes vão do verde da marca ao amarelo de vagalume.
TEMAS = {
    "escuro": dict(fundo="#070b12", borda="#223047", barra="#0e1623", texto="#e6edf3", chave="#83f28f",
                   mudo="#8b98a9", vazio="#172335", luz=["#2f8a55", "#4fc276", "#83f28f", "#eaff8c"],
                   halo="#b6ff7a", halo_alfa=[0, 0.22, 0.38, 0.6], flash="#fdffe0", soltos=True),
    "claro": dict(fundo="#ffffff", borda="#d0d7de", barra="#f6f8fa", texto="#1f2328", chave="#1a7f37",
                  mudo="#59636e", vazio="#e4e9ee", luz=["#9be9a8", "#40c463", "#2da44e", "#1a7f37"],
                  halo="#40c463", halo_alfa=[0, 0, 0.16, 0.26], flash=None, soltos=False),
}
RAIO = [0.22, 0.27, 0.31, 0.35]       # raio da luz por nível, em fração do passo da grade
RAIO_HALO = [0, 0.48, 0.6, 0.74]
PISCAM = 12                           # quantos dias mais fortes ficam piscando


# ---------- dados ----------
def buscar_graphql(usuario, token):
    q = ("query($login:String!){user(login:$login){contributionsCollection{contributionCalendar"
         "{weeks{contributionDays{date contributionCount}}}}}}")
    req = urllib.request.Request(
        "https://api.github.com/graphql",
        data=json.dumps({"query": q, "variables": {"login": usuario}}).encode(),
        headers={"Authorization": f"bearer {token}", "Content-Type": "application/json", "User-Agent": "vagalumes"})
    with urllib.request.urlopen(req, timeout=30) as r:
        d = json.load(r)
    semanas = d["data"]["user"]["contributionsCollection"]["contributionCalendar"]["weeks"]
    return {x["date"]: x["contributionCount"] for s in semanas for x in s["contributionDays"]}


def buscar_html(usuario):
    # Página pública do calendário, a mesma que aparece no perfil. Não é API
    # oficial, então só entra se a de cima falhar.
    req = urllib.request.Request(f"https://github.com/users/{usuario}/contributions",
                                 headers={"User-Agent": "vagalumes"})
    with urllib.request.urlopen(req, timeout=30) as r:
        h = r.read().decode("utf-8", "replace")
    dias, nivel = {}, {}
    for td in re.findall(r"<td[^>]*ContributionCalendar-day[^>]*>", h):
        data, ident = re.search(r'data-date="([\d-]+)"', td), re.search(r'\sid="([^"]+)"', td)
        if data and ident:
            dias[ident.group(1)] = data.group(1)
            n = re.search(r'data-level="(\d)"', td)
            nivel[ident.group(1)] = int(n.group(1)) if n else 0
    conta = {}
    for ident, texto in re.findall(r'<tool-tip[^>]*\sfor="([^"]+)"[^>]*>([^<]*)</tool-tip>', h):
        n = re.match(r"\s*([\d,.]+)", texto)
        conta[ident] = int(re.sub(r"\D", "", n.group(1))) if n else 0
    if not dias:
        raise ValueError("calendário não encontrado na página")
    return {d: conta.get(i, nivel[i]) for i, d in dias.items()}


def carregar(args):
    if args.dados:
        bruto = json.load(open(args.dados, encoding="utf-8"))
    else:
        bruto, erros = None, []
        token = os.environ.get("GITHUB_TOKEN")
        if token:
            try:
                bruto = buscar_graphql(args.usuario, token)
            except Exception as e:  # cai para a página pública
                erros.append(f"graphql: {e}")
        if bruto is None:
            try:
                bruto = buscar_html(args.usuario)
            except Exception as e:
                erros.append(f"página: {e}")
        if bruto is None:
            print("Sem dados hoje; o mapa anterior continua no ar.", *erros, sep="\n", file=sys.stderr)
            return None
    return {dt.date.fromisoformat(k): int(v) for k, v in bruto.items()}


# ---------- contas ----------
def domingo(d):
    return d - dt.timedelta(days=(d.weekday() + 1) % 7)


def inicio_da_fase(dias, fim, max_sem):
    """Domingo em que começa a fase atual: logo depois da última pausa de 4
    semanas ou mais. Assim o mapa mostra a construção de agora, e não um ano
    quase vazio. Fica entre 8 e max_sem semanas."""
    dom = domingo(fim)
    inicio, vazias = None, 0
    for k in range(max_sem):
        d0 = dom - dt.timedelta(weeks=k)
        if sum(dias.get(d0 + dt.timedelta(days=i), 0) for i in range(7)):
            inicio, vazias = k, 0
        else:
            vazias += 1
            if vazias >= 4 and inicio is not None:
                break
    k = min(max(inicio or 0, 7), max_sem - 1)
    return dom - dt.timedelta(weeks=k)


def numeros(dias, ini, fim):
    seq = [ini + dt.timedelta(days=i) for i in range((fim - ini).days + 1)]
    ativos = [d for d in seq if dias.get(d, 0) > 0]
    primeiro = ativos[0] if ativos else fim
    # sequência atual: se hoje ainda está zerado, conta até ontem
    d = fim if dias.get(fim, 0) else fim - dt.timedelta(days=1)
    atual = 0
    while dias.get(d, 0) > 0:
        atual += 1
        d -= dt.timedelta(days=1)
    maior = corrida = 0
    for x in seq:
        corrida = corrida + 1 if dias.get(x, 0) else 0
        maior = max(maior, corrida)
    return dict(total=sum(dias.get(x, 0) for x in seq), primeiro=primeiro, ativos=len(ativos),
                janela=(fim - primeiro).days + 1, atual=atual, maior=maior,
                pico=max((dias.get(x, 0) for x in seq), default=0))


def niveis(valores):
    nz = sorted(v for v in valores if v > 0)
    if not nz:
        return lambda v: -1
    cortes = [nz[min(len(nz) - 1, int(len(nz) * f))] for f in (0.25, 0.5, 0.75)]
    return lambda v: -1 if v <= 0 else sum(v > c for c in cortes)


def plural(n, um, varios):
    return f"{n} {um if n == 1 else varios}"


# ---------- desenho ----------
def janela(p, t, larg, alt, topo, celular):
    # igual à janela do terminal do mesmo tamanho, para os dois cartões combinarem
    p.append(f'<rect x="1" y="1" width="{larg - 2}" height="{alt - 2}" rx="14" fill="{t["fundo"]}" stroke="{t["borda"]}" stroke-width="2"/>')
    p.append(f'<path d="M1 15a14 14 0 0 1 14-14h{larg - 30}a14 14 0 0 1 14 14v{topo - 15}H1z" fill="{t["barra"]}"/>')
    p.append(f'<line x1="1" y1="{topo}" x2="{larg - 1}" y2="{topo}" stroke="{t["borda"]}" stroke-width="1.5"/>')
    for i, cor in enumerate(["#ff5f57", "#febc2e", "#28c840"]):
        if celular:
            p.append(f'<circle cx="{22 + i * 20}" cy="{topo / 2}" r="6" fill="{cor}"/>')
        else:
            p.append(f'<circle cx="{24 + i * 22}" cy="{topo / 2}" r="6.5" fill="{cor}"/>')
    if not celular:
        p.append(f'<text x="{larg / 2}" y="{topo / 2 + 5}" text-anchor="middle" font-family="{FONTE}" font-size="13" fill="{t["mudo"]}">thulio@mestria — zsh</text>')


def prompt(t):
    return f'<tspan fill="{t["chave"]}" font-weight="700">thulio@mestria</tspan><tspan fill="{t["mudo"]}">:~$</tspan>'


def desenhar(dias, fim, ini_fase, est, tema, celular):
    t = TEMAS[tema]
    if celular:
        larg, pad, topo, fs, lh, fs_peq, passo_max, max_sem = 500, 22, 40, 17, 27, 13, 26, 18
        xt = pad                # margem do texto, a mesma do terminal do celular
    else:
        larg, pad, topo, fs, lh, fs_peq, passo_max, max_sem = 900, 28, 44, 15, 24, 12, 30, 53
        xt = pad + 10
    dom_fim = domingo(fim)
    ini = max(ini_fase, dom_fim - dt.timedelta(weeks=max_sem - 1))
    n = (dom_fim - ini).days // 7 + 1
    nivel = niveis([dias.get(ini_fase + dt.timedelta(days=i), 0) for i in range((fim - ini_fase).days + 1)])

    rot = 34                    # coluna dos dias da semana
    larg_info = 252             # bloco de números ao lado da grade (só no computador)
    if celular:
        passo = min(passo_max, (larg - 2 * pad - rot - 8) / n)
        gx = (larg - (rot + n * passo)) / 2 + rot
    else:
        passo = min(passo_max, (larg - 2 * pad - rot - 64 - larg_info) / n)
        comp = rot + n * passo + 64 + larg_info
        gx = (larg - comp) / 2 + rot
    y_cmd = topo + 30
    y_mes = y_cmd + 44
    gtop = y_mes + 10
    gbot = gtop + 7 * passo
    y_leg = gbot + 28
    y_cap = y_leg + 24

    linhas = [
        ("Total", plural(est["total"], "contribuição", "contribuições")),
        ("Desde", f'{MESES_EXT[est["primeiro"].month - 1]} de {est["primeiro"].year}'),
        ("Acesos", f'{est["ativos"]} de {plural(est["janela"], "dia", "dias")}'),
        ("Agora", plural(est["atual"], "dia seguido", "dias seguidos") if est["atual"] else "recomeçando"),
        ("Recorde", plural(est["maior"], "dia seguido", "dias seguidos")),
        ("Pico", f'{est["pico"]} num dia só'),
    ]
    alt_info = lh * (len(linhas) + 2)
    if celular:
        x_info, y_info = xt, y_cap + 48
        fim_conteudo = y_info + alt_info - lh
    else:
        x_info = gx + n * passo + 64
        bloco = y_cap - (y_mes - 14)
        y_info = (y_mes - 14) + max(0, (bloco - alt_info) / 2) + 16
        fim_conteudo = max(y_cap, y_info + alt_info - lh)
    y_cursor = fim_conteudo + 46
    alt = int(y_cursor + 24)

    rnd = random.Random(fim.isoformat() + tema + str(celular))
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{larg}" height="{alt}" viewBox="0 0 {larg} {alt}" role="img" '
         f'aria-label="Vagalumes: {est["total"]} contribuições desde {MESES_EXT[est["primeiro"].month - 1]} de {est["primeiro"].year}, '
         f'{est["ativos"]} dias com código e {est["atual"]} dias seguidos agora">']
    larg_cmd = 0.6 * fs * len("thulio@mestria:~$ vagalumes") + 20
    defs = [f'<clipPath id="digita"><rect x="{xt}" y="{y_cmd - 20}" width="0" height="28">'
            f'<animate attributeName="width" from="0" to="{larg_cmd:.0f}" begin="0.3s" dur="0.7s" fill="freeze"/></rect></clipPath>']
    for i in range(1, 4):
        if t["halo_alfa"][i]:
            defs.append(f'<radialGradient id="h{i}"><stop offset="0" stop-color="{t["halo"]}" stop-opacity="{t["halo_alfa"][i]}"/>'
                        f'<stop offset="1" stop-color="{t["halo"]}" stop-opacity="0"/></radialGradient>')
    defs.append(f'<radialGradient id="hs"><stop offset="0" stop-color="#f4ff3a" stop-opacity="0.75"/>'
                f'<stop offset="1" stop-color="#b6ff7a" stop-opacity="0"/></radialGradient>')
    p.append("<defs>" + "".join(defs) + "</defs>")
    janela(p, t, larg, alt, topo, celular)
    p.append(f'<g clip-path="url(#digita)"><text x="{xt}" y="{y_cmd}" font-family="{FONTE}" font-size="{fs}" fill="{t["texto"]}">'
             f'{prompt(t)} vagalumes</text></g>')

    # dias da semana e meses
    t_grade = 1.15
    surge = f'opacity="0"><animate attributeName="opacity" from="0" to="1" begin="{t_grade:.2f}s" dur="0.3s" fill="freeze"/>'
    for linha, nome in ((1, "seg"), (3, "qua"), (5, "sex")):
        p.append(f'<text x="{gx - 8:.1f}" y="{gtop + (linha + 0.5) * passo + fs_peq * 0.35:.1f}" text-anchor="end" font-family="{FONTE}" '
                 f'font-size="{fs_peq}" fill="{t["mudo"]}" {surge}{nome}</text>')
    ultimo_x = -99
    for c in range(n):
        d0 = ini + dt.timedelta(weeks=c)
        mes = next((d0 + dt.timedelta(days=i) for i in range(7) if (d0 + dt.timedelta(days=i)).day == 1), None)
        if c == 0:
            mes = d0 if d0.day <= 24 else None
        x = gx + c * passo
        if mes and x - ultimo_x >= 0.6 * fs_peq * 4:
            p.append(f'<text x="{x:.1f}" y="{y_mes}" font-family="{FONTE}" font-size="{fs_peq}" fill="{t["mudo"]}" {surge}{MESES[mes.month - 1]}</text>')
            ultimo_x = x

    # grade: cada coluna acende em sequência, da esquerda para a direita
    passo_t = min(0.11, 1.5 / n)
    fortes = sorted((d for d in dias if ini <= d <= fim and nivel(dias[d]) >= 2), key=lambda d: (dias[d], d), reverse=True)[:PISCAM]
    t_fim_grade = t_grade + 0.15 + n * passo_t + 0.3
    for c in range(n):
        d0 = ini + dt.timedelta(weeks=c)
        cx = gx + (c + 0.5) * passo
        luzes, halos, piscam = [], [], []
        for r in range(7):
            d = d0 + dt.timedelta(days=r)
            if d > fim:
                break
            cy = gtop + (r + 0.5) * passo
            nv = nivel(dias.get(d, 0))
            if nv < 0:
                luzes.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{max(1.3, passo * 0.1):.1f}" fill="{t["vazio"]}"/>')
                continue
            halo = (f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{passo * RAIO_HALO[nv]:.1f}" fill="url(#h{nv})"/>'
                    if t["halo_alfa"][nv] else "")
            luz = f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{passo * RAIO[nv]:.1f}" fill="{t["luz"][nv]}"/>'
            if d in fortes:
                # os dias mais fortes dão um flash de vez em quando, como vagalume
                # de verdade: o brilho cresce rápido e volta, e o miolo clareia
                rh, dur, beg = passo * RAIO_HALO[nv], rnd.uniform(3.2, 6.0), t_fim_grade + rnd.uniform(0, 3.0)
                tempo = f'keyTimes="0;0.07;0.22;1" dur="{dur:.2f}s" begin="{beg:.2f}s" repeatCount="indefinite"'
                halo = (f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rh:.1f}" fill="url(#h{nv})">'
                        f'<animate attributeName="r" values="{rh:.1f};{rh * 1.55:.1f};{rh:.1f};{rh:.1f}" {tempo}/></circle>')
                miolo = ""
                if t["flash"]:
                    miolo = f'<animate attributeName="fill" values="{t["luz"][nv]};{t["flash"]};{t["luz"][nv]};{t["luz"][nv]}" {tempo}/>'
                piscam.append(f'{halo}<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{passo * RAIO[nv]:.1f}" fill="{t["luz"][nv]}">{miolo}</circle>')
            else:
                halos.append(halo)
                luzes.append(luz)
        b = t_grade + 0.15 + c * passo_t
        p.append(f'<g opacity="0">{"".join(halos)}{"".join(luzes)}{"".join(piscam)}'
                 f'<animate attributeName="opacity" from="0" to="1" begin="{b:.2f}s" dur="0.35s" fill="freeze"/></g>')

    # legenda
    surge2 = f'opacity="0"><animate attributeName="opacity" from="0" to="1" begin="{t_fim_grade:.2f}s" dur="0.4s" fill="freeze"/>'
    x0 = gx
    lg = [f'<text x="{x0:.1f}" y="{y_leg}" font-family="{FONTE}" font-size="{fs_peq}" fill="{t["mudo"]}">menos</text>']
    xx = x0 + 0.6 * fs_peq * 5 + 12
    pl = 15
    lg.append(f'<circle cx="{xx:.1f}" cy="{y_leg - fs_peq * 0.35:.1f}" r="1.6" fill="{t["vazio"]}"/>')
    for nv in range(4):
        xx += pl
        lg.append(f'<circle cx="{xx:.1f}" cy="{y_leg - fs_peq * 0.35:.1f}" r="{3 + nv * 0.9:.1f}" fill="{t["luz"][nv]}"/>')
    lg.append(f'<text x="{xx + 12:.1f}" y="{y_leg}" font-family="{FONTE}" font-size="{fs_peq}" fill="{t["mudo"]}">mais</text>')
    p.append(f'<g {surge2}{"".join(lg)}</g>')
    p.append(f'<text x="{x0:.1f}" y="{y_cap}" font-family="{FONTE}" font-size="{fs_peq + 1}" fill="{t["texto"]}" {surge2}'
             f'cada vagalume é um dia de código</text>')

    # números, linha a linha, como o cartão do terminal
    t0 = t_fim_grade + 0.3
    itens = [("titulo", "construindo em público"), ("traco", "─" * 22)] + [("par", k, v) for k, v in linhas]
    for i, item in enumerate(itens):
        y = y_info + i * lh
        anim = f'<animate attributeName="opacity" from="0" to="1" begin="{t0 + i * 0.16:.2f}s" dur="0.25s" fill="freeze"/>'
        if item[0] == "titulo":
            p.append(f'<text x="{x_info:.1f}" y="{y:.1f}" font-family="{FONTE}" font-size="{fs + 1}" font-weight="700" fill="{t["chave"]}" opacity="0">{item[1]}{anim}</text>')
        elif item[0] == "traco":
            p.append(f'<text x="{x_info:.1f}" y="{y:.1f}" font-family="{FONTE}" font-size="{fs}" fill="{t["mudo"]}" opacity="0">{item[1]}{anim}</text>')
        else:
            p.append(f'<text x="{x_info:.1f}" y="{y:.1f}" font-family="{FONTE}" font-size="{fs}" xml:space="preserve" opacity="0">'
                     f'<tspan fill="{t["chave"]}" font-weight="700">{escape(item[1])}</tspan>'
                     f'<tspan fill="{t["texto"]}" x="{x_info + 0.6 * fs * 9:.1f}">{escape(item[2])}</tspan>{anim}</text>')

    # vagalumes soltos voando por cima da grade (só no escuro: no branco somem)
    if t["soltos"]:
        t_voo = t0 + len(itens) * 0.16
        x_min, x_max = gx - 10, gx + n * passo + (20 if celular else 40)
        y_min, y_max = gtop - 6, gbot + 6
        for _ in range(5 if celular else 7):
            pts = [(rnd.uniform(x_min, x_max), rnd.uniform(y_min, y_max)) for _ in range(4)]
            d = f"M{pts[0][0]:.0f} {pts[0][1]:.0f}"
            for a, b in zip(pts, pts[1:] + pts[:1]):
                mx, my = (a[0] + b[0]) / 2 + rnd.uniform(-30, 30), (a[1] + b[1]) / 2 + rnd.uniform(-20, 20)
                d += f" Q{mx:.0f} {my:.0f} {b[0]:.0f} {b[1]:.0f}"
            beg = t_voo + rnd.uniform(0, 3)
            p.append(f'<g opacity="0"><circle r="11" fill="url(#hs)"/><circle r="2.1" fill="#f6ffb0"/>'
                     f'<animateMotion path="{d}" dur="{rnd.uniform(16, 26):.1f}s" begin="{beg:.2f}s" repeatCount="indefinite"/>'
                     f'<animate attributeName="opacity" values="0;0.95;0.25;0.85;0" dur="{rnd.uniform(5, 8):.1f}s" begin="{beg:.2f}s" repeatCount="indefinite"/></g>')

    # cursor piscando no fim
    tc = t0 + len(itens) * 0.16 + 0.3
    p.append(f'<text x="{xt}" y="{y_cursor:.1f}" font-family="{FONTE}" font-size="{fs}" opacity="0">{prompt(t)}'
             f'<animate attributeName="opacity" from="0" to="1" begin="{tc:.2f}s" dur="0.1s" fill="freeze"/></text>')
    xc = xt + 0.6 * fs * 19
    p.append(f'<rect x="{xc:.1f}" y="{y_cursor - fs + 1:.1f}" width="{fs * 0.6:.0f}" height="{fs + 3}" fill="{t["texto"]}" opacity="0">'
             f'<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.01;0.5;0.51;1" dur="1.1s" begin="{tc:.2f}s" repeatCount="indefinite"/></rect>')
    p.append("</svg>")
    return "\n".join(p)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--usuario", default=os.environ.get("GITHUB_REPOSITORY_OWNER", "semnick46"))
    ap.add_argument("--saida", required=True)
    ap.add_argument("--dados", help="JSON {data: contribuições} para testar sem internet")
    args = ap.parse_args()
    dias = carregar(args)
    if not dias:
        return
    fim = max(dias)
    ini_fase = inicio_da_fase(dias, fim, 53)
    est = numeros(dias, ini_fase, fim)
    os.makedirs(args.saida, exist_ok=True)
    for tema in TEMAS:
        for celular, nome in ((False, f"vagalumes-{tema}.svg"), (True, f"vagalumes-celular-{tema}.svg")):
            with open(os.path.join(args.saida, nome), "w", encoding="utf-8") as f:
                f.write(desenhar(dias, fim, ini_fase, est, tema, celular))
    print(f"{est['total']} contribuições de {est['primeiro']} a {fim}; {est['ativos']} de {est['janela']} dias acesos; "
          f"agora {est['atual']} seguidos, recorde {est['maior']}, pico {est['pico']}")


if __name__ == "__main__":
    main()
