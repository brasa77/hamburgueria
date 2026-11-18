from pathlib import Path
from html.parser import HTMLParser
import re
class Audit(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.refs=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        for key in ('src','href'):
            value=a.get(key,'')
            if value and not value.startswith(('http','#','data:')):self.refs.append(value)
a=Audit();a.feed(Path('index.html').read_text(encoding='utf-8'))
assert len(a.ids)==len(set(a.ids)), 'Duplicate HTML IDs'
refs=a.refs+re.findall(r"image:'([^']+)'",Path('script.js').read_text(encoding='utf-8'))
missing=[p for p in refs if not Path(p).is_file()]
assert not missing, missing
catalog=Path('script.js').read_text(encoding='utf-8').split('const groups')[0]
assert len(re.findall(r"\{ id:'",catalog))==50
assert len(list(Path('assets/hero').glob('*.webp')))==23
print(f'PASS: {len(a.ids)} unique IDs; {len(refs)} local file references; 50 products; 23 original frames retained.')
