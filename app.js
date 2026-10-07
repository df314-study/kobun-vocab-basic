const DB_NAME="KobunMasterDB", DB_VER=5;
let db, words=[], settings={daily:30,weakWeight:5};
let session={mode:"today",queue:[],index:0,current:null,start:0,conf:null};

const seedWords=[{"id":"seed-001","word":"見る","meaning":"思う・世話をする・関係を結ぶ","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-002","word":"見す","meaning":"見せる・結婚させる","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-003","word":"見ゆ","meaning":"見える・思われる・見せる・結婚する","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-004","word":"かいまみる","meaning":"のぞき見る","pos":"—","conj":"—","level":"基礎"},{"id":"seed-005","word":"よばふ","meaning":"呼び続ける・求婚する","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-006","word":"好く","meaning":"風流を好む・恋愛に熱中する","pos":"—","conj":"—","level":"基礎"},{"id":"seed-007","word":"わたる","meaning":"通る・いらっしゃる・〜し続ける・一面に〜する","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-008","word":"ありく","meaning":"出歩く・〜し回る・〜し続ける","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-009","word":"おこなふ","meaning":"仏道修行をする","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-010","word":"なやむ","meaning":"病気になる・苦しむ","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-011","word":"おこたる","meaning":"病気が治る","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-012","word":"おくる","meaning":"先立たれる・後に残される","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-013","word":"ながむ","meaning":"物思いに沈む・歌を口ずさむ","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-014","word":"ときめく","meaning":"寵愛を受ける・栄える","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-015","word":"かしづく","meaning":"大切に育てる・世話をする","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-016","word":"めづ","meaning":"愛する・感嘆する","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-017","word":"おどろく","meaning":"目を覚ます・気づく","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-018","word":"こうず","meaning":"疲れる・困る","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-019","word":"おぼゆ","meaning":"思われる・思い出される・似る","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-020","word":"聞こゆ","meaning":"聞こえる・評判になる・分かる","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-021","word":"まもる","meaning":"見つめる","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-022","word":"たのむ","meaning":"あてにする・あてにさせる","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-023","word":"かづく","meaning":"かぶる・いただく・与える","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-024","word":"ののしる","meaning":"大声で騒ぐ・評判になる・勢いが盛んだ","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-025","word":"やる","meaning":"送る・〜しきれない","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-026","word":"いらふ","meaning":"答える","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-027","word":"にほふ","meaning":"美しく映える・香りがする","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-028","word":"あきらむ","meaning":"明らかにする","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-029","word":"ねんず","meaning":"我慢する・祈る","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-030","word":"まうく","meaning":"準備する・用意する","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-031","word":"ゐる","meaning":"座る・〜ている・連れる","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-032","word":"具す","meaning":"伴う・連れる・添える","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-033","word":"経","meaning":"時間がたつ・通る","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-034","word":"さる","meaning":"避ける・その時になる・立ち去る","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-035","word":"ものす","meaning":"する・いらっしゃる","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-036","word":"ならふ","meaning":"慣れる・なじむ","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-037","word":"しのぶ","meaning":"我慢する・人目を避ける・思い出す","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-038","word":"わぶ","meaning":"困る・嘆く・〜しかねる","pos":"動詞","conj":"—","level":"基礎"},{"id":"seed-039","word":"をかし","meaning":"すばらしい・趣がある・おもしろい","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-040","word":"よろし","meaning":"悪くはない・まあよい","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-041","word":"ありがたし","meaning":"めったにない・すばらしい","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-042","word":"つきづきし","meaning":"似つかわしい・ふさわしい","pos":"—","conj":"—","level":"基礎"},{"id":"seed-043","word":"なまめかし","meaning":"上品だ・若々しい","pos":"—","conj":"—","level":"基礎"},{"id":"seed-044","word":"めでたし","meaning":"すばらしい","pos":"—","conj":"—","level":"基礎"},{"id":"seed-045","word":"うるはし","meaning":"きちんとしている・美しい","pos":"—","conj":"—","level":"基礎"},{"id":"seed-046","word":"やむごとなし","meaning":"高貴だ・並々でない","pos":"—","conj":"—","level":"基礎"},{"id":"seed-047","word":"おとなし","meaning":"思慮分別がある・主だった立場だ","pos":"—","conj":"—","level":"基礎"},{"id":"seed-048","word":"ゆかし","meaning":"見たい・聞きたい・知りたい・心ひかれる","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-049","word":"なつかし","meaning":"親しみ深い・心ひかれる","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-050","word":"はづかし","meaning":"立派だ・こちらが恥ずかしくなるほどだ","pos":"—","conj":"—","level":"基礎"},{"id":"seed-051","word":"こころにくし","meaning":"奥ゆかしい・上品だ","pos":"—","conj":"—","level":"基礎"},{"id":"seed-052","word":"うつくし","meaning":"かわいい・いとしい","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-053","word":"かなし","meaning":"いとしい・かわいい","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-054","word":"らうたし","meaning":"かわいい・いじらしい","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-055","word":"めやすし","meaning":"感じがよい・見苦しくない","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-056","word":"あやし","meaning":"不思議だ・身分が低い・粗末だ","pos":"—","conj":"—","level":"基礎"},{"id":"seed-057","word":"さうざうし","meaning":"もの足りない・さびしい","pos":"—","conj":"—","level":"基礎"},{"id":"seed-058","word":"つれなし","meaning":"平然としている・冷淡だ","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-059","word":"なめし","meaning":"無礼だ","pos":"—","conj":"—","level":"基礎"},{"id":"seed-060","word":"おどろおどろし","meaning":"大げさだ・気味が悪い","pos":"—","conj":"—","level":"基礎"},{"id":"seed-061","word":"うし","meaning":"つらい・いやだ","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-062","word":"むつかし","meaning":"うっとうしい・気味が悪い","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-063","word":"すさまじ","meaning":"興ざめだ・殺風景だ","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-064","word":"びんなし","meaning":"不都合だ・気の毒だ","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-065","word":"いとほし","meaning":"気の毒だ","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-066","word":"いはけなし","meaning":"子どもっぽい","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-067","word":"つらし","meaning":"薄情だ","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-068","word":"ところせし","meaning":"窮屈だ・大げさだ","pos":"—","conj":"—","level":"基礎"},{"id":"seed-069","word":"うしろめたし","meaning":"気がかりだ","pos":"—","conj":"—","level":"基礎"},{"id":"seed-070","word":"かたはらいたし","meaning":"きまりが悪い・苦々しい・気の毒だ","pos":"—","conj":"—","level":"基礎"},{"id":"seed-071","word":"わりなし","meaning":"ひどい・どうしようもない・苦しい","pos":"—","conj":"—","level":"基礎"},{"id":"seed-072","word":"本意なし","meaning":"残念だ・不本意だ","pos":"—","conj":"—","level":"基礎"},{"id":"seed-073","word":"あさまし","meaning":"驚くほどだ・あきれるほどだ・情けない","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-074","word":"めざまし","meaning":"気に食わない・すばらしい","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-075","word":"いみじ","meaning":"すばらしい・ひどい・とても","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-076","word":"ゆゆし","meaning":"不吉だ・すばらしい・はなはだしい","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-077","word":"やさし","meaning":"優美だ・上品だ・殊勝だ","pos":"形容詞","conj":"—","level":"基礎"},{"id":"seed-078","word":"しるし","meaning":"はっきりしている・〜のとおりだ","pos":"—","conj":"—","level":"基礎"},{"id":"seed-079","word":"とし","meaning":"早い","pos":"—","conj":"—","level":"基礎"},{"id":"seed-080","word":"ゆくりなし","meaning":"突然だ・思いがけない","pos":"—","conj":"—","level":"基礎"},{"id":"seed-081","word":"おぼつかなし","meaning":"はっきりしない・気がかりだ・待ち遠しい","pos":"—","conj":"—","level":"基礎"},{"id":"seed-082","word":"こころもとなし","meaning":"かすかだ・不安だ・じれったい","pos":"—","conj":"—","level":"基礎"},{"id":"seed-083","word":"あはれなり","meaning":"しみじみと心に感じる","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-084","word":"つれづれなり","meaning":"退屈だ・もの寂しい","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-085","word":"すずろなり","meaning":"なんとなく・思いがけず・むやみに","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-086","word":"まめなり","meaning":"まじめだ・実用的だ","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-087","word":"あだなり","meaning":"はかない・浮気だ","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-088","word":"いたづらなり","meaning":"役に立たない・むなしい","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-089","word":"いうなり","meaning":"優れている・優雅だ","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-090","word":"あてなり","meaning":"高貴だ・上品だ","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-091","word":"あからさまなり","meaning":"ほんの少し・一時的だ","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-092","word":"みそかなり","meaning":"ひそかだ","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-093","word":"おろかなり","meaning":"いい加減だ・並一通りだ・言い尽くせない","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-094","word":"をこなり","meaning":"愚かだ・ばかばかしい","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-095","word":"むげなり","meaning":"ひどい・ひどく","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-096","word":"なかなかなり","meaning":"中途半端だ・かえって","pos":"形容動詞","conj":"—","level":"基礎"},{"id":"seed-097","word":"手","meaning":"字・演奏法","pos":"—","conj":"—","level":"基礎"},{"id":"seed-098","word":"文","meaning":"手紙・漢詩","pos":"—","conj":"—","level":"基礎"},{"id":"seed-099","word":"消息","meaning":"手紙・訪問の申し入れ","pos":"—","conj":"—","level":"基礎"},{"id":"seed-100","word":"あそび","meaning":"管弦・詩歌などの遊び","pos":"—","conj":"—","level":"基礎"},{"id":"seed-101","word":"たより","meaning":"よりどころ・つて・よい機会","pos":"—","conj":"—","level":"基礎"},{"id":"seed-102","word":"物語","meaning":"世間話・物語","pos":"—","conj":"—","level":"基礎"},{"id":"seed-103","word":"ためし","meaning":"先例","pos":"—","conj":"—","level":"基礎"},{"id":"seed-104","word":"いそぎ","meaning":"準備","pos":"—","conj":"—","level":"基礎"},{"id":"seed-105","word":"用意","meaning":"気配り","pos":"—","conj":"—","level":"基礎"},{"id":"seed-106","word":"かたち","meaning":"容姿・顔立ち","pos":"—","conj":"—","level":"基礎"},{"id":"seed-107","word":"かげ","meaning":"光・姿","pos":"—","conj":"—","level":"基礎"},{"id":"seed-108","word":"けしき","meaning":"様子・気配","pos":"—","conj":"—","level":"基礎"},{"id":"seed-109","word":"こころざし","meaning":"お礼の贈り物・厚意","pos":"—","conj":"—","level":"基礎"},{"id":"seed-110","word":"ほい","meaning":"かねてからの願い・本来の意志","pos":"—","conj":"—","level":"基礎"},{"id":"seed-111","word":"こと","meaning":"言葉・事柄","pos":"—","conj":"—","level":"基礎"},{"id":"seed-112","word":"わざ","meaning":"こと・行為・葬儀","pos":"—","conj":"—","level":"基礎"},{"id":"seed-113","word":"よろづ","meaning":"さまざまなこと・すべて","pos":"—","conj":"—","level":"基礎"},{"id":"seed-114","word":"ことわり","meaning":"道理・理由","pos":"—","conj":"—","level":"基礎"},{"id":"seed-115","word":"ひがこと","meaning":"間違い・道理に反すること","pos":"—","conj":"—","level":"基礎"},{"id":"seed-116","word":"そらごと","meaning":"うそ・偽り","pos":"—","conj":"—","level":"基礎"},{"id":"seed-117","word":"れう","meaning":"ため・料金・材料","pos":"—","conj":"—","level":"基礎"},{"id":"seed-118","word":"ろく","meaning":"ほうび・給与","pos":"—","conj":"—","level":"基礎"},{"id":"seed-119","word":"としごろ","meaning":"長年の間・年来","pos":"—","conj":"—","level":"基礎"},{"id":"seed-120","word":"つとめて","meaning":"早朝・翌朝","pos":"—","conj":"—","level":"基礎"},{"id":"seed-121","word":"世","meaning":"男女の仲・世の中","pos":"—","conj":"—","level":"標準"},{"id":"seed-122","word":"いかで","meaning":"なんとかして・どうして","pos":"—","conj":"—","level":"標準"},{"id":"seed-123","word":"いかが","meaning":"どうして・どのように","pos":"—","conj":"—","level":"標準"},{"id":"seed-124","word":"など","meaning":"なぜ・どうして","pos":"—","conj":"—","level":"標準"},{"id":"seed-125","word":"いつしか","meaning":"いつの間にか・早く","pos":"—","conj":"—","level":"標準"},{"id":"seed-126","word":"おのづから","meaning":"自然に・たまたま・もし","pos":"—","conj":"—","level":"標準"},{"id":"seed-127","word":"なほ","meaning":"やはり・それでも","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-128","word":"いとど","meaning":"ますます","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-129","word":"げに","meaning":"本当に","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-130","word":"かく","meaning":"このように","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-131","word":"さ","meaning":"そのように","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-132","word":"しか","meaning":"そのように","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-133","word":"と","meaning":"あのように","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-134","word":"やがて","meaning":"そのまま・すぐに","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-135","word":"すなはち","meaning":"すぐに・つまり","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-136","word":"やうやう","meaning":"だんだん・しだいに","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-137","word":"やをら","meaning":"そっと・静かに","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-138","word":"なかなかに","meaning":"かえって・中途半端に","pos":"—","conj":"—","level":"標準"},{"id":"seed-139","word":"さすがに","meaning":"そうはいってもやはり","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-140","word":"かたみに","meaning":"互いに","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-141","word":"うたて","meaning":"いやな感じに・異様に","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-142","word":"なべて","meaning":"一般に・一様に","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-143","word":"わざと","meaning":"わざわざ・格別に","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-144","word":"あまた","meaning":"たくさん","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-145","word":"ここら","meaning":"たくさん・たいそう","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-146","word":"え〜打消","meaning":"〜できない","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-147","word":"な〜そ","meaning":"〜するな・〜してはならない","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-148","word":"おほかた","meaning":"まったく・だいたい","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-149","word":"さらに","meaning":"まったく・そのうえ","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-150","word":"よに","meaning":"まったく・実に","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-151","word":"たえて","meaning":"まったく〜ない","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-152","word":"つゆ","meaning":"少しも〜ない","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-153","word":"ゆめ","meaning":"決して〜ない・決して〜するな","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-154","word":"つやつや","meaning":"まったく〜ない","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-155","word":"をさをさ","meaning":"ほとんど〜ない","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-156","word":"よも","meaning":"まさか〜ないだろう","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-157","word":"あなかしこ","meaning":"決して〜するな・恐れ多い","pos":"副詞・連語","conj":"—","level":"標準"},{"id":"seed-158","word":"ためらふ","meaning":"気持ちを静める・ためらう","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-159","word":"やすらふ","meaning":"ためらう・立ち止まる","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-160","word":"かたらふ","meaning":"語り合う・親しく交際する・契る","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-161","word":"すむ","meaning":"女のもとに通う","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-162","word":"やむ","meaning":"終わる","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-163","word":"うつろふ","meaning":"色あせる・移り変わる","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-164","word":"みいだす","meaning":"外を見る・見つけ出す","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-165","word":"もてなす","meaning":"振る舞う・取り扱う","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-166","word":"あつかふ","meaning":"面倒を見る・もてあます","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-167","word":"あくがる","meaning":"さまよい出る・浮かれ歩く","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-168","word":"あふ","meaning":"結婚する・耐えられる・〜しきれない","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-169","word":"しほたる","meaning":"涙を流す","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-170","word":"かきくらす","meaning":"空を暗くする・悲しみにくれる","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-171","word":"まどふ","meaning":"迷う・ひどく〜する","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-172","word":"たばかる","meaning":"工夫する・だます","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-173","word":"すさぶ","meaning":"興じる・気の向くままにする","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-174","word":"すまふ","meaning":"抵抗する・断る","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-175","word":"まねぶ","meaning":"まねる・伝える","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-176","word":"ねぶ","meaning":"年をとる・大人びる","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-177","word":"おきつ","meaning":"あらかじめ決める・指図する","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-178","word":"うれふ","meaning":"訴える・嘆く","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-179","word":"むすぶ","meaning":"できる・すくう","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-180","word":"とぶらふ","meaning":"訪れる・見舞う・弔う","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-181","word":"やつす","meaning":"質素にする・出家する","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-182","word":"さはる","meaning":"差し支える・妨げられる","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-183","word":"かしこまる","meaning":"恐縮する・正座する","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-184","word":"かこつ","meaning":"嘆く・他のことにかこつける","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-185","word":"わく","meaning":"分ける・理解する","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-186","word":"つつむ","meaning":"遠慮する・慎む","pos":"動詞","conj":"—","level":"標準"},{"id":"seed-187","word":"あらまほし","meaning":"望ましい・理想的だ","pos":"—","conj":"—","level":"標準"},{"id":"seed-188","word":"らうらうじ","meaning":"巧みだ・上品だ","pos":"—","conj":"—","level":"標準"},{"id":"seed-189","word":"うるせし","meaning":"賢い・巧みだ","pos":"—","conj":"—","level":"標準"},{"id":"seed-190","word":"はかばかし","meaning":"しっかりしている・はっきりしている","pos":"—","conj":"—","level":"標準"},{"id":"seed-191","word":"をさをさし","meaning":"しっかりしている・ほとんど〜ない","pos":"—","conj":"—","level":"標準"},{"id":"seed-192","word":"さうなし","meaning":"比べるものがない","pos":"—","conj":"—","level":"標準"},{"id":"seed-193","word":"くまなし","meaning":"陰がない・何でも知っている","pos":"—","conj":"—","level":"標準"},{"id":"seed-194","word":"ずちなし","meaning":"どうしようもない","pos":"—","conj":"—","level":"標準"},{"id":"seed-195","word":"さがなし","meaning":"意地が悪い・いたずらだ","pos":"—","conj":"—","level":"標準"},{"id":"seed-196","word":"あいなし","meaning":"つまらない・なんとなく","pos":"—","conj":"—","level":"標準"},{"id":"seed-197","word":"まさなし","meaning":"よくない","pos":"—","conj":"—","level":"標準"},{"id":"seed-198","word":"はかなし","meaning":"頼りない・はかない","pos":"—","conj":"—","level":"標準"},{"id":"seed-199","word":"こころづきなし","meaning":"気に食わない","pos":"—","conj":"—","level":"標準"},{"id":"seed-200","word":"あへなし","meaning":"あっけない・落胆している","pos":"—","conj":"—","level":"標準"},{"id":"seed-201","word":"おほけなし","meaning":"身のほど知らずだ","pos":"—","conj":"—","level":"標準"},{"id":"seed-202","word":"よしなし","meaning":"つまらない・関係がない","pos":"—","conj":"—","level":"標準"},{"id":"seed-203","word":"はしたなし","meaning":"中途半端だ・きまりが悪い・そっけない","pos":"—","conj":"—","level":"標準"},{"id":"seed-204","word":"しどけなし","meaning":"だらしない・気楽だ","pos":"—","conj":"—","level":"標準"},{"id":"seed-205","word":"いぎたなし","meaning":"寝坊だ・寝苦しい","pos":"—","conj":"—","level":"標準"},{"id":"seed-206","word":"ひとわろし","meaning":"みっともない","pos":"—","conj":"—","level":"標準"},{"id":"seed-207","word":"いぶせし","meaning":"うっとうしい・気がかりだ","pos":"—","conj":"—","level":"標準"},{"id":"seed-208","word":"くちをし","meaning":"残念だ・くやしい","pos":"形容詞","conj":"—","level":"標準"},{"id":"seed-209","word":"あたらし","meaning":"惜しい","pos":"—","conj":"—","level":"標準"},{"id":"seed-210","word":"ねたし","meaning":"くやしい・しゃくにさわる","pos":"形容詞","conj":"—","level":"標準"},{"id":"seed-211","word":"こちたし","meaning":"うるさい・大げさだ・はなはだしい","pos":"—","conj":"—","level":"標準"},{"id":"seed-212","word":"けし","meaning":"異様だ・怪しい","pos":"—","conj":"—","level":"標準"},{"id":"seed-213","word":"わびし","meaning":"苦しい・つらい・心細い","pos":"形容詞","conj":"—","level":"標準"},{"id":"seed-214","word":"こころぐるし","meaning":"気の毒だ・気がかりだ","pos":"—","conj":"—","level":"標準"},{"id":"seed-215","word":"まだし","meaning":"まだ早い・未熟だ","pos":"—","conj":"—","level":"標準"},{"id":"seed-216","word":"さかし","meaning":"優れている・こざかしい","pos":"—","conj":"—","level":"標準"},{"id":"seed-217","word":"まばゆし","meaning":"まぶしい・美しい・恥ずかしい","pos":"—","conj":"—","level":"標準"},{"id":"seed-218","word":"かたじけなし","meaning":"恐れ多い・面目ない","pos":"—","conj":"—","level":"標準"},{"id":"seed-219","word":"かしこし","meaning":"恐れ多い・優れている","pos":"—","conj":"—","level":"標準"},{"id":"seed-220","word":"しげし","meaning":"多い","pos":"形容詞","conj":"—","level":"標準"},{"id":"seed-221","word":"すごし","meaning":"気味が悪い・寂しい・すばらしい","pos":"形容詞","conj":"—","level":"標準"},{"id":"seed-222","word":"いたし","meaning":"すばらしい・ひどい・はなはだしい","pos":"—","conj":"—","level":"標準"},{"id":"seed-223","word":"おぼろけなり","meaning":"普通だ・並々でない","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-224","word":"なのめなり","meaning":"並一通りだ・いい加減だ","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-225","word":"きよらなり","meaning":"清らかで美しい","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-226","word":"けうらなり","meaning":"清らかで美しい","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-227","word":"まほなり","meaning":"完全だ・十分だ","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-228","word":"あらはなり","meaning":"まる見えだ・明らかだ","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-229","word":"あながちなり","meaning":"強引だ・むやみだ","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-230","word":"せちなり","meaning":"切実だ・大切だ","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-231","word":"とみなり","meaning":"急だ・突然だ","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-232","word":"うちつけなり","meaning":"にわかだ・軽率だ","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-233","word":"さらなり","meaning":"言うまでもない","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-234","word":"ねんごろなり","meaning":"心をこめている・親密だ","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-235","word":"おいらかなり","meaning":"おっとりしている","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-236","word":"あやにくなり","meaning":"意地が悪い・あいにくだ","pos":"形容動詞","conj":"—","level":"標準"},{"id":"seed-237","word":"おぼえ","meaning":"評判・寵愛","pos":"—","conj":"—","level":"標準"},{"id":"seed-238","word":"ひま","meaning":"すき間・暇","pos":"—","conj":"—","level":"標準"},{"id":"seed-239","word":"いとま","meaning":"暇・休むこと","pos":"—","conj":"—","level":"標準"},{"id":"seed-240","word":"ざえ","meaning":"教養・才能","pos":"—","conj":"—","level":"標準"},{"id":"seed-241","word":"よろこび","meaning":"お礼・祝儀","pos":"—","conj":"—","level":"発展"},{"id":"seed-242","word":"こころばへ","meaning":"気だて・心づかい・趣","pos":"—","conj":"—","level":"発展"},{"id":"seed-243","word":"こころづくし","meaning":"もの思いをすること","pos":"—","conj":"—","level":"発展"},{"id":"seed-244","word":"そこ","meaning":"あなた・そこ","pos":"—","conj":"—","level":"発展"},{"id":"seed-245","word":"ここ","meaning":"このわたし・ここ","pos":"—","conj":"—","level":"発展"},{"id":"seed-246","word":"かれ","meaning":"あの人・あれ","pos":"—","conj":"—","level":"発展"},{"id":"seed-247","word":"それ","meaning":"その人・それ","pos":"—","conj":"—","level":"発展"},{"id":"seed-248","word":"これ","meaning":"このわたし・これ","pos":"—","conj":"—","level":"発展"},{"id":"seed-249","word":"あなた","meaning":"向こう・あちら","pos":"—","conj":"—","level":"発展"},{"id":"seed-250","word":"そなた","meaning":"あなた・そちら","pos":"—","conj":"—","level":"発展"},{"id":"seed-251","word":"こなた","meaning":"このわたし・こちら","pos":"—","conj":"—","level":"発展"},{"id":"seed-252","word":"そのかみ","meaning":"その当時・その昔","pos":"—","conj":"—","level":"発展"},{"id":"seed-253","word":"せうと","meaning":"兄・兄弟","pos":"—","conj":"—","level":"発展"},{"id":"seed-254","word":"おとうと","meaning":"弟・妹","pos":"—","conj":"—","level":"発展"},{"id":"seed-255","word":"いもうと","meaning":"妹・いとしい女性","pos":"—","conj":"—","level":"発展"},{"id":"seed-256","word":"つま","meaning":"夫・妻","pos":"—","conj":"—","level":"発展"},{"id":"seed-257","word":"はらから","meaning":"兄弟姉妹","pos":"—","conj":"—","level":"発展"},{"id":"seed-258","word":"かたえ","meaning":"半分・仲間・そば","pos":"—","conj":"—","level":"発展"},{"id":"seed-259","word":"ほど","meaning":"ころ・広さ・身分・程度","pos":"—","conj":"—","level":"発展"},{"id":"seed-260","word":"かぎり","meaning":"限界・極致・臨終・すべて","pos":"—","conj":"—","level":"発展"},{"id":"seed-261","word":"きは","meaning":"身分・程度・境目","pos":"—","conj":"—","level":"発展"},{"id":"seed-262","word":"ついで","meaning":"順序・機会","pos":"—","conj":"—","level":"発展"},{"id":"seed-263","word":"沙汰","meaning":"評議・裁き・命令・噂","pos":"—","conj":"—","level":"発展"},{"id":"seed-264","word":"とが","meaning":"欠点・罪","pos":"—","conj":"—","level":"発展"},{"id":"seed-265","word":"け","meaning":"ため・気配","pos":"—","conj":"—","level":"発展"},{"id":"seed-266","word":"よし","meaning":"風情・由緒・手立て・理由","pos":"—","conj":"—","level":"発展"},{"id":"seed-267","word":"やう","meaning":"様子・理由・方法","pos":"—","conj":"—","level":"発展"},{"id":"seed-268","word":"ちぎり","meaning":"約束・宿縁","pos":"—","conj":"—","level":"発展"},{"id":"seed-269","word":"ほだし","meaning":"障害となるもの","pos":"—","conj":"—","level":"発展"},{"id":"seed-270","word":"あやめ","meaning":"道理・筋道","pos":"—","conj":"—","level":"発展"},{"id":"seed-271","word":"うつつ","meaning":"現実・正気","pos":"—","conj":"—","level":"発展"},{"id":"seed-272","word":"あるじ","meaning":"もてなし・主人","pos":"—","conj":"—","level":"発展"},{"id":"seed-273","word":"ふるさと","meaning":"なじみの土地・わが家","pos":"—","conj":"—","level":"発展"},{"id":"seed-274","word":"さて","meaning":"そのまま・そのほか","pos":"—","conj":"—","level":"発展"},{"id":"seed-275","word":"さながら","meaning":"そのまま・すべて","pos":"—","conj":"—","level":"発展"},{"id":"seed-276","word":"いま","meaning":"すぐに・もう","pos":"—","conj":"—","level":"発展"},{"id":"seed-277","word":"せめて","meaning":"強いて・ひどく","pos":"—","conj":"—","level":"発展"},{"id":"seed-278","word":"むべ","meaning":"なるほど・もっともだ","pos":"—","conj":"—","level":"発展"},{"id":"seed-279","word":"かつ","meaning":"一方では・すぐに","pos":"—","conj":"—","level":"発展"},{"id":"seed-280","word":"ひねもす","meaning":"一日中","pos":"—","conj":"—","level":"発展"},{"id":"seed-281","word":"かまへて","meaning":"決して〜ない・なんとかして","pos":"—","conj":"—","level":"発展"},{"id":"seed-282","word":"あへて","meaning":"あえて・まったく〜ない","pos":"副詞・連語","conj":"—","level":"発展"},{"id":"seed-283","word":"かけて","meaning":"まったく・決して〜ない","pos":"—","conj":"—","level":"発展"},{"id":"seed-284","word":"さだめて","meaning":"きっと・必ず","pos":"—","conj":"—","level":"発展"},{"id":"seed-285","word":"のたまふ","meaning":"おっしゃる","pos":"—","conj":"—","level":"発展"},{"id":"seed-286","word":"おほす","meaning":"おっしゃる・命じる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-287","word":"申す","meaning":"申し上げる・〜と申し上げる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-288","word":"奏す","meaning":"申し上げる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-289","word":"啓す","meaning":"申し上げる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-290","word":"承る","meaning":"お受けする・お聞きする","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-291","word":"給ふ","meaning":"お与えになる・下さる・〜なさる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-292","word":"たまはす","meaning":"お与えになる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-293","word":"たまはる","meaning":"いただく","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-294","word":"召す","meaning":"お呼びになる・お召しになる・お取り寄せになる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-295","word":"思す","meaning":"お思いになる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-296","word":"おほとのごもる","meaning":"おやすみになる","pos":"—","conj":"—","level":"発展"},{"id":"seed-297","word":"さぶらふ","meaning":"お仕えする・あります","pos":"—","conj":"—","level":"発展"},{"id":"seed-298","word":"はべり","meaning":"お仕えする・あります","pos":"—","conj":"—","level":"発展"},{"id":"seed-299","word":"奉る","meaning":"差し上げる・お召しになる・召し上がる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-300","word":"参らす","meaning":"差し上げる・申し上げる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-301","word":"まゐる","meaning":"参上する・差し上げる・召し上がる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-302","word":"まかる","meaning":"退出する・参上する","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-303","word":"あそばす","meaning":"なさる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-304","word":"つかうまつる","meaning":"お仕えする・〜申し上げる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-305","word":"ご覧ず","meaning":"ご覧になる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-306","word":"きこしめす","meaning":"お聞きになる・召し上がる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-307","word":"しろしめす","meaning":"知っていらっしゃる・お治めになる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-308","word":"おはす","meaning":"いらっしゃる・〜ていらっしゃる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-309","word":"います","meaning":"いらっしゃる・〜ていらっしゃる","pos":"動詞","conj":"—","level":"発展"},{"id":"seed-310","word":"あかず","meaning":"満足しない・飽きることがない","pos":"—","conj":"—","level":"発展"},{"id":"seed-311","word":"あからめもせず","meaning":"よそ見もしない","pos":"—","conj":"—","level":"発展"},{"id":"seed-312","word":"あなかま","meaning":"ああうるさい・静かに","pos":"—","conj":"—","level":"発展"},{"id":"seed-313","word":"あらぬ","meaning":"別の・違う","pos":"—","conj":"—","level":"発展"},{"id":"seed-314","word":"ありありて","meaning":"生き続けて・結局","pos":"—","conj":"—","level":"発展"},{"id":"seed-315","word":"ありし","meaning":"以前の・生前の","pos":"—","conj":"—","level":"発展"}];

function reqToPromise(req){return new Promise((res,rej)=>{req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error)})}
async function openDB(){
 return new Promise((resolve,reject)=>{
  const r=indexedDB.open(DB_NAME,DB_VER);
  r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains("words"))d.createObjectStore("words",{keyPath:"id"});if(!d.objectStoreNames.contains("settings"))d.createObjectStore("settings",{keyPath:"key"});};
  r.onsuccess=()=>{db=r.result;resolve()};
  r.onerror=()=>reject(r.error);
 });
}
async function getAll(store){return reqToPromise(db.transaction(store,"readonly").objectStore(store).getAll())}
async function put(store,obj){return reqToPromise(db.transaction(store,"readwrite").objectStore(store).put(obj))}
async function init(){
 await openDB();
 words=await getAll("words");
 // v4以前のseed-01〜seed-12をv5のseed-001〜seed-012へ移行
 for(const w of [...words]){
   const m=/^seed-(\d{2})$/.exec(w.id);
   if(m){
     const nid=`seed-${m[1].padStart(3,"0")}`;
     if(!words.some(x=>x.id===nid)){ w.id=nid; await put("words",w); }
     else { await reqToPromise(db.transaction("words","readwrite").objectStore("words").delete(w.id)); }
   }
 }
 words=await getAll("words");
 const existing=new Map(words.map(w=>[w.id,w]));
 if(words.length<seedWords.length){
   for(const seed of seedWords){
     if(!existing.has(seed.id)) await put("words",{...seed,stats:blankStats()});
   }
   words=await getAll("words");
 }
 const ss=await getAll("settings");for(const x of ss)settings[x.key]=x.value;
 renderHome();
 registerSW();
}
function blankStats(){return {correct:0,wrong:0,confidenceYes:0,confidenceNo:0,responseTimes:[],weakness:0,lastStudied:null,streak:0,nextReview:null,studyCount:0}}
function levelClass(l){return l==="基礎"?"basic":l==="発展"?"advanced":"standard"}
function toast(t){const e=document.getElementById("toast");e.textContent=t;e.style.display="block";setTimeout(()=>e.style.display="none",1800)}
function show(id){
 document.querySelectorAll(".view").forEach(x=>{
   x.classList.remove("active");
   x.setAttribute("aria-hidden","true");
 });
 const target=document.getElementById(id);
 if(!target)return;
 target.classList.add("active");
 target.setAttribute("aria-hidden","false");
 const study=document.getElementById("study");
 if(study && id!=="study"){
   study.classList.remove("active");
   study.setAttribute("aria-hidden","true");
 }
 window.scrollTo(0,0);
}
function goHome(){show("home");renderHome()}
function showSettings(){show("settings");document.getElementById("daily").value=settings.daily;document.getElementById("weakWeight").value=settings.weakWeight;document.getElementById("weakWeightText").textContent=settings.weakWeight}
function saveSettings(){settings.daily=Math.max(1,Math.min(300,+document.getElementById("daily").value||30));settings.weakWeight=+document.getElementById("weakWeight").value;put("settings",{key:"daily",value:settings.daily});put("settings",{key:"weakWeight",value:settings.weakWeight});toast("設定を保存しました")}
function todayKey(){const d=new Date();return new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Tokyo"}).format(d)}
function todayDone(){
 const key=todayKey();
 return words.reduce((n,w)=>{
   const t=w.stats?.lastStudied;
   if(!t)return n;
   return n+(new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Tokyo"}).format(new Date(t))===key?1:0);
 },0);
}
function renderHome(){
 document.getElementById("todayText").textContent=`目標 ${settings.daily}語。弱点を優先して出題します。`;
 document.getElementById("todayCount").textContent=todayDone();
 document.getElementById("weakCount").textContent=words.filter(w=>(w.stats?.weakness||0)>0).length;
 document.getElementById("allCount").textContent=words.length;
}
function priority(w,mode){
 const s=w.stats; let p=s.weakness*settings.weakWeight;
 const overdue=s.nextReview?Math.max(0,Math.min(35,Math.floor((Date.now()-new Date(s.nextReview).getTime())/86400000)*6)):20;
 p+=overdue;
 if(mode==="review")p+=s.wrong*8+(s.nextReview&&Date.now()>=new Date(s.nextReview).getTime()?25:0);
 if(mode==="basic")p+=w.level==="基礎"?50:-999;
 if(mode==="standard")p+=w.level==="標準"?50:-999;
 if(mode==="advanced")p+=w.level==="発展"?50:-999;
 p+=Math.random()*5;
 return p;
}
function startMode(mode){
 let pool=words.filter(w=>mode==="basic"?w.level==="基礎":mode==="standard"?w.level==="標準":mode==="advanced"?w.level==="発展":true);
 if(mode==="weak")pool=pool.filter(w=>w.stats.weakness>0);
 if(mode==="review")pool=pool.filter(w=>w.stats.wrong>0||w.stats.weakness>20);
 if(!pool.length){toast("対象の単語がありません");return}
 pool.sort((a,b)=>priority(b,mode)-priority(a,mode));
 const n=Math.min(settings.daily,pool.length);
 session={mode,queue:pool.slice(0,n),index:0,current:null,start:0,conf:null};
 document.getElementById("modeTitle").textContent={today:"今日の学習",weak:"苦手単語",review:"復習",basic:"基礎",standard:"標準",advanced:"発展"}[mode]||"学習";
 show("study");loadCard();
}
function loadCard(){
 const w=session.queue[session.index];session.current=w;session.start=performance.now();session.conf=null;
 document.getElementById("studyNum").textContent=`${session.index+1}/${session.queue.length}`;
 document.getElementById("progressBar").style.width=`${session.index/session.queue.length*100}%`;
 document.getElementById("front").innerHTML=`<div class="tagline"><span class="pill ${levelClass(w.level)}">${w.level}</span></div><div class="bigword">${esc(w.word)}</div><div class="hint">右：自信あり　／　左：自信なし</div>`;
 document.getElementById("answer").style.display="none";document.getElementById("confidenceBtns").style.display="grid";document.getElementById("correctBtns").style.display="none";document.getElementById("swipeHelp").textContent="右スワイプ＝自信あり　左スワイプ＝自信なし";
}
async function confidence(yes){
 if(!session.current)return;
 session.conf=yes;const t=(performance.now()-session.start)/1000;
 session.current._rt=t;
 const s=session.current.stats;
 s.responseTimes.push(Math.round(t*10)/10);if(s.responseTimes.length>20)s.responseTimes.shift();
 yes?s.confidenceYes++:s.confidenceNo++;
 const rtPenalty=t>=3?7:0;
 s.weakness=Math.max(0,Math.min(100,s.weakness+(yes?-8:8)+rtPenalty));
 await put("words",session.current);showAnswer();
}
function showAnswer(){
 const w=session.current;
 document.getElementById("answer").style.display="block";
 document.getElementById("answer").innerHTML=`<div class="meaning">${esc(w.meaning)}</div><div class="detail"><b>品詞：</b>${esc(w.pos||"—")}<br><b>活用：</b>${esc(w.conj||"—")}<br><b>重要度：</b>${esc(w.level)}<br><span style="font-size:12px;color:#667085">回答時間 ${w._rt.toFixed(1)}秒</span></div>`;
 document.getElementById("confidenceBtns").style.display="none";document.getElementById("correctBtns").style.display="grid";document.getElementById("swipeHelp").textContent="右スワイプ＝正解　左スワイプ＝不正解";
}
async function correctness(ok){
 const w=session.current,s=w.stats;
 ok?(s.correct++,s.streak++):(s.wrong++,s.streak=0);
 s.studyCount=(s.studyCount||0)+1;
 s.lastStudied=new Date().toISOString();
 const gap=ok?(s.streak>=3?7:(s.streak>=2?3:1)):0;
 s.nextReview=new Date(Date.now()+gap*86400000).toISOString();
 const rtPenalty=w._rt>=3?5:0;
 if(ok)s.weakness=Math.max(0,s.weakness-(session.conf?5:3)+rtPenalty);
 else s.weakness=Math.min(100,s.weakness+(session.conf?22:15)+rtPenalty);
 delete w._rt;await put("words",w);
 words=words.map(x=>x.id===w.id?w:x);
 renderHome();
 session.index++;
 if(session.index>=session.queue.length){document.getElementById("progressBar").style.width="100%";toast("学習完了！");setTimeout(goHome,500);return}
 loadCard();
}
function showList(){show("list");renderList()}
function renderList(){
 const q=(document.getElementById("search").value||"").toLowerCase(),lv=document.getElementById("levelFilter").value;
 const arr=words.filter(w=>(!lv||w.level===lv)&&(!q||`${w.word} ${w.meaning} ${w.pos}`.toLowerCase().includes(q))).sort((a,b)=>b.stats.weakness-a.stats.weakness);
 document.getElementById("wordList").innerHTML=arr.length?arr.map(w=>{const avg=w.stats.responseTimes?.length?(w.stats.responseTimes.reduce((a,b)=>a+b,0)/w.stats.responseTimes.length).toFixed(1):"—";return `<div class="row"><div><div class="word">${esc(w.word)} <span class="pill ${levelClass(w.level)}">${w.level}</span></div><div class="meta">${esc(w.meaning)}　｜　${esc(w.pos||"—")}　｜　弱点 ${Math.round(w.stats.weakness)}　｜　平均 ${avg}秒</div></div><div class="meta">${w.stats.correct}正 / ${w.stats.wrong}誤</div></div>`}).join(""):`<div class="empty">該当する単語がありません。</div>`;
}
document.getElementById("search").addEventListener("input",renderList);document.getElementById("levelFilter").addEventListener("change",renderList);
document.getElementById("weakWeight").addEventListener("input",e=>document.getElementById("weakWeightText").textContent=e.target.value);
document.getElementById("importFile").addEventListener("change",restoreBackup);
document.getElementById("vocabFile").addEventListener("change",importVocab);

async function exportBackup(){
 const payload={version:1,exportedAt:new Date().toISOString(),words,settings};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 downloadBlob(blob,`kobun-master-backup-${todayKey()}.json`);
}
async function restoreBackup(e){
 const f=e.target.files[0];if(!f)return;const data=JSON.parse(await f.text());
 if(!data.words||!Array.isArray(data.words))throw new Error("不正なバックアップ");
 for(const w of data.words)await put("words",w);
 for(const k of Object.keys(data.settings||{}))await put("settings",{key:k,value:data.settings[k]});
 words=await getAll("words");Object.assign(settings,data.settings||{});renderHome();toast("バックアップを復元しました");
 e.target.value="";
}
async function importVocab(e){
 const f=e.target.files[0];if(!f)return;
 try{
  const text=await f.text();let rows=[];
  if(f.name.toLowerCase().endsWith(".json"))rows=JSON.parse(text);
  else rows=parseCSV(text);
  if(!Array.isArray(rows))rows=[rows];
  let imported=0,skipped=0,updated=0,added=0;
  const existing=new Map((await getAll("words")).map(w=>[w.id,w]));
  for(const x of rows){
   if(!x||!String(x.word||"").trim()||!String(x.meaning||"").trim()){skipped++;continue;}
   const word=String(x.word).trim();
   // idがない場合も同じ単語を再インポートすれば同じIDになるようにする
   const id=String(x.id||(`imp-${encodeURIComponent(word)}`)).trim();
   const prev=existing.get(id);
   const stats=x.stats&&typeof x.stats==="object" ? x.stats : (prev?.stats||blankStats());
   const item={id,word,meaning:String(x.meaning).trim(),pos:String(x.pos||"—").trim(),conj:String(x.conj||"—").trim(),level:["基礎","標準","発展"].includes(String(x.level||"").trim())?String(x.level).trim():"標準",stats};
   await put("words",item);
   imported++;
   if(prev){updated++;}else{added++;}
   existing.set(id,item);
  }
  words=await getAll("words");renderHome();
  toast(`取込 ${imported}件（新規${added}・更新${updated}・無効${skipped}）`);
 }catch(err){
  console.error(err);
  toast("読み込みに失敗しました。CSV/JSON形式を確認してください");
 }finally{e.target.value="";}
}
function parseCSV(t){
 const lines=[];let row=[],cell="",quoted=false;
 for(let i=0;i<t.length;i++){
  const c=t[i],n=t[i+1];
  if(c==='\"'){if(quoted&&n==='\"'){cell+='\"';i++;}else{quoted=!quoted;}}
  else if(c===','&&!quoted){row.push(cell.trim());cell="";}
  else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&n==='\n')i++;row.push(cell.trim());cell="";if(row.some(v=>v!=="")){lines.push(row);}row=[];}
  else{cell+=c;}
 }
 row.push(cell.trim());if(row.some(v=>v!==""))lines.push(row);
 if(!lines.length)return [];
 const head=lines.shift().map(x=>x.replace(/^\uFEFF/,"").trim());
 return lines.map(vals=>{const o={};head.forEach((h,i)=>o[h]=vals[i]??"");return o;});
}
function downloadBlob(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

let sx=0,sy=0;
const fc=document.getElementById("flashcard");
fc.addEventListener("pointerdown",e=>{sx=e.clientX;sy=e.clientY;fc.setPointerCapture(e.pointerId)});
fc.addEventListener("pointerup",e=>{const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.2){if(document.getElementById("confidenceBtns").style.display!=="none")confidence(dx>0);else correctness(dx>0)}});

async function registerSW(){if("serviceWorker"in navigator&&location.protocol!=="file:"){try{await navigator.serviceWorker.register("./sw.js")}catch(e){console.warn(e)}}}
document.getElementById("homeBtn").onclick=goHome;
init();
