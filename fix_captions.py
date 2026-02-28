import re
import os

def update_file(filepath, replacements):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content, n = re.subn(old, new, content, flags=re.DOTALL)
        print(f"Replaced {n} times in {filepath}")
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replacements_dincer = [
    (r'<figcaption[^>]*>\s*Prof\. Dr\.\s*Nazire Nergiz Dinçer, Gökçenur Başaran, and Ezgi Eylem Erdoğan during the interview\.\s*</figcaption>', 
     r'<figcaption style="font-size:.85rem;color:var(--clr-text-secondary);margin-top:.5rem;">5: Prof. Dr. Nazire Nergiz Dinçer, Gökçenur Başaran, and Ezgi Eylem Erdoğan during the interview. (It is also correct so don\'t change.)</figcaption>')
]

replacements_openai = [
    (r'<figcaption[^>]*>\s*Google\s*Gemini, 2025\s*</figcaption>',
     r'<figcaption style="font-size:.85rem;color:var(--clr-text-secondary);margin-top:.5rem;">7: before Google Gemini, 2025</figcaption>')
]

replacements_basci = [
    (r'<figcaption[^>]*>\s*Prof\. Dr\.\s*Erdem Başçı, Arda Akgül and Mustafa Boydaş during the interview\.\s*</figcaption>',
     r'<figcaption style="font-size:.85rem;color:var(--clr-text-secondary);margin-top:.5rem;">8: Prof. Dr. Erdem Başçı, Arda Akgül and, Mustafa Boydaş during the interview.</figcaption>'),
    (r'(<img src="https://miro\.medium\.com/v2/resize:fit:679/format:webp/0\*jX2Ea30cbQgFMSaV"[^>]*>)\s*</figure>',
     r'\1\n                    <figcaption style="font-size:.85rem;color:var(--clr-text-secondary);margin-top:.5rem;">9: As TED University Economics Research Union, we thank Prof. Dr. Başçı for this special interview and his support in our works.</figcaption>\n                </figure>')
]

replacements_syria = [
    (r'<figcaption[^>]*>\s*Ranking of\s*Selected Countries, Based on Zonal Statistics of Practical PV Power Potential \(The World Bank,\s*2020\)\s*</figcaption>',
     r'<figcaption style="font-size:.85rem;color:var(--clr-text-secondary);margin-top:.5rem;">10: Rankıng Of Selected Countrıes, Based On Zonal Statıstıcs Of Practıcal PV Power Potentıal (The World Bank, 2020)</figcaption>'),
    (r'<figcaption[^>]*>\s*Electricity\s*generation per sources, as of 2023\. \(IEA, 2025\)\s*</figcaption>',
     r'<figcaption style="font-size:.85rem;color:var(--clr-text-secondary);margin-top:.5rem;">11: Electricity generation per sources, as of 2023. (IEA, 2025)</figcaption>'),
    (r'<figcaption[^>]*>\s*The location\s*of Sheikh Najjar Solar Plant, located in Aleppo\.\s*</figcaption>',
     r'<figcaption style="font-size:.85rem;color:var(--clr-text-secondary);margin-top:.5rem;">12: The location of Sheikh Najjar Solar Plant, located in Aleppo.</figcaption>')
]

replacements_serbest = [
    (r'<figcaption[^>]*>\s*Figür 1:\s*Türkiye(?:&#39;|\')de Telekom sektörünün konsantrasyon seviyesi\s*</figcaption>',
     r'<figcaption style="font-size:.85rem;color:var(--clr-text-secondary);margin-top:.5rem;">13: Figür 1: Türkiye’de Telekom sektörünün konsantrasyon seviyesi</figcaption>'),
    (r'<figcaption[^>]*>\s*Figür 2: 14\s*Car Companies Control a Combined 60 Brands\s*</figcaption>',
     r'<figcaption style="font-size:.85rem;color:var(--clr-text-secondary);margin-top:.5rem;">14: Figür 2: Araba sektöründeki şirketlerin dağılımı</figcaption>'),
    (r'<figcaption[^>]*>\s*Figür 3: İç\s*Hat Yolcu Trafiğinde Hava Yolu Şirketlerinin Yolcu Payları \(2024\)\s*</figcaption>',
     r'<figcaption style="font-size:.85rem;color:var(--clr-text-secondary);margin-top:.5rem;">15: Figür 3: İç Hat Yolcu Trafiğinde Hava Yolu Şirketlerinin Yolcu Payları (2024)</figcaption>')
]

update_file('c:/Users/akgul/Downloads/tedueru/article-dincer.html', replacements_dincer)
update_file('c:/Users/akgul/Downloads/tedueru/article-openai.html', replacements_openai)
update_file('c:/Users/akgul/Downloads/tedueru/article-basci.html', replacements_basci)
update_file('c:/Users/akgul/Downloads/tedueru/article-syria.html', replacements_syria)
update_file('c:/Users/akgul/Downloads/tedueru/article-serbest.html', replacements_serbest)
print("Done!")
