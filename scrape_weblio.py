#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Weblio古語辞典（学研全訳古語辞典）から、単語ごと・意味ごとの例文を取得して
examples_v19.csv を作るスクリプト。自分のPCで実行してください（標準ライブラリのみ・Python3.8+）。

  python3 scrape_weblio.py                 # vocab_v19.csv の全語を処理（約610語、1語あたり約2秒）
  python3 scrape_weblio.py --limit 20      # 試しに先頭20語だけ
  python3 scrape_weblio.py --words ゆかし,あはれ

・取得済みページは ./weblio_cache/ に保存されるので、中断しても続きから再開できます。
・出力 examples_v19.csv をアプリの［設定］→［例文データ(CSV)を取り込む］で読み込みます。
・下線部(underline)は語幹の一致で自動推定した値です。ずれている場合はCSVを直接編集してください。
・取得した本文は各辞書の著作物です。個人学習の範囲で、アクセス間隔を空けて利用してください。
"""
import argparse, csv, html, os, re, sys, time, urllib.parse, urllib.request
from html.parser import HTMLParser

MARK = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳"
BLOCK = {"p","div","br","li","tr","td","th","h1","h2","h3","h4","dt","dd","section","table"}

class T(HTMLParser):
    def __init__(s):
        super().__init__(); s.o=[]; s.skip=0
    def handle_starttag(s,t,a):
        if t in ("script","style"): s.skip+=1
        if t in BLOCK: s.o.append("\n")
    def handle_endtag(s,t):
        if t in ("script","style"): s.skip-=1
        if t in BLOCK: s.o.append("\n")
    def handle_data(s,d):
        if not s.skip: s.o.append(d)

def html_to_text(h):
    p=T(); p.feed(h)
    t=html.unescape("".join(p.o))
    return re.sub(r"\n\s*\n+","\n",t)

def parse_text(text):
    """ページ本文から [{no, meaning, examples:[{source,sentence,translation}]}] を取り出す"""
    m=re.search(r"["+MARK+"]",text)
    if not m: return []
    end=len(text)
    for key in ("索引トップ","ページへのリンク","の関連用語"):
        k=text.find(key,m.start())
        if k!=-1: end=min(end,k)
    body=text[m.start():end]
    flat=re.sub(r"\s+"," ",body)
    parts=re.split("(["+MARK+"])",flat)
    senses=[]; no=0
    for i in range(1,len(parts),2):
        no+=1; chunk=parts[i+1].strip()
        segs=re.split(r"出典",chunk)
        meaning=segs[0].strip(" 　")
        meaning=re.sub(r"\[[^\]]*\]","",meaning).strip(" 　")
        meaning=meaning.rstrip("。").replace("。","・")
        exs=[]
        for seg in segs[1:]:
            mm=re.match(r"\s*([^「]*?)\s*「(.+?)」\s*(?:\[訳\]\s*(.*))?$",seg)
            if not mm: continue
            src,sent,tr=mm.group(1).strip(),mm.group(2).strip(),(mm.group(3) or "").strip()
            sent=re.sub(r"[―－]\S{1,6}$","",sent)               # 句末の「―芭蕉」など作者名を除く
            if tr.startswith("⇒") or not tr: tr=""      # 「⇒やまぢきて…」など参照のみの訳は空にする
            exs.append({"source":src,"sentence":sent,"translation":tr})
        senses.append({"no":no,"meaning":meaning,"examples":exs})
    return senses

def app_senses(m):
    m=m.strip()
    if m.startswith("A") and re.search(r"\sB",m):
        parts=[re.sub(r"^[A-D]\s*","",x).strip() for x in re.split(r"\s+(?=[B-D](?![A-Za-z]))",m)]
        parts=[x for x in parts if x]
        if len(parts)>1: return parts
    return [m]

def forms(word):
    head=re.sub(r"[（(][^）)]*[）)]","",word).strip()
    alts=[]
    for g in re.findall(r"[（(]([^）)]*)[）)]",word):
        alts+=[x.strip() for x in re.split(r"[・/／]",g) if x.strip() and not x.strip().startswith(("~","～"))]
    return [head]+alts

def guess_underline(word,sentence):
    for f in forms(word):
        f=re.sub(r"[~～].*$","",f)
        if not f: continue
        for k in range(len(f),max(len(f)-2,1)-1,-1):   # 語幹（末尾2字まで削って）で探す
            stem=f[:k]
            if len(stem)>=2 or k==len(f):
                if stem in sentence: return stem
    return ""

def fetch(word,cache):
    path=os.path.join(cache,urllib.parse.quote(word,safe="")+".html")
    if os.path.exists(path): return open(path,encoding="utf-8").read(),False
    url="https://kobun.weblio.jp/content/"+urllib.parse.quote(word)
    req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0 (personal study tool)","Accept-Language":"ja"})
    with urllib.request.urlopen(req,timeout=20) as r: h=r.read().decode("utf-8","replace")
    open(path,"w",encoding="utf-8").write(h); return h,True

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--vocab",default="vocab_v19.csv"); ap.add_argument("--out",default="examples_v19.csv")
    ap.add_argument("--limit",type=int,default=0); ap.add_argument("--words",default="")
    ap.add_argument("--wait",type=float,default=1.5)
    a=ap.parse_args()
    rows=list(csv.DictReader(open(a.vocab,encoding="utf-8-sig")))
    if a.words:
        want=set(a.words.split(",")); rows=[r for r in rows if re.sub(r"[（(].*","",r["word"]) in want]
    if a.limit: rows=rows[:a.limit]
    os.makedirs("weblio_cache",exist_ok=True)
    out=[]; miss=[]; report=[]
    for n,r in enumerate(rows,1):
        head=forms(r["word"])[0]
        try: h,net=fetch(head,"weblio_cache")
        except Exception as e:
            print(f"[{n}/{len(rows)}] {head}: 取得失敗 {e}"); miss.append(head); continue
        senses=parse_text(html_to_text(h)); cnt=0
        for s in senses:
            for k,ex in enumerate(s["examples"],1):
                out.append({"word_id":r["id"],"word":r["word"],"sense_no":s["no"],"ex_no":k,"meaning":s["meaning"],
                  "sentence":ex["sentence"],"underline":guess_underline(r["word"],ex["sentence"]),
                  "translation":ex["translation"],"source":ex["source"]}); cnt+=1
        if not cnt: miss.append(head)
        na=len(app_senses(r["meaning"]))
        if senses and len(senses)!=na: report.append([r["id"],r["word"],na,len(senses),r["meaning"]," / ".join(s["meaning"] for s in senses)])
        print(f"[{n}/{len(rows)}] {head}: 意味{len(senses)}・例文{cnt}")
        if net: time.sleep(a.wait)
    cols=["word_id","word","sense_no","ex_no","meaning","sentence","underline","translation","source"]
    with open(a.out,"w",encoding="utf-8-sig",newline="") as f:
        w=csv.DictWriter(f,fieldnames=cols); w.writeheader(); w.writerows(out)
    with open("examples_v19_check.csv","w",encoding="utf-8-sig",newline="") as f:
        w=csv.writer(f); w.writerow(["word_id","word","アプリの意味数","Weblioの意味数","アプリの意味","Weblioの意味"]); w.writerows(report)
    print(f"意味の数がアプリとWeblioで違う語: {len(report)}件 → examples_v19_check.csv（番号の対応を確認してください）")
    print(f"\n完了: {len(out)}件 → {a.out}\n例文が取れなかった語({len(miss)}): "+"、".join(miss[:80]))

if __name__=="__main__": main()
