import json, sys
sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parents[1]/"tmp/python-deps"))
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
import qrcode
import qrcode.image.svg
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'tmp/settlements.json').read_text(encoding='utf-8'))
fmt=lambda v: 'US$ '+f'{v/100:,.2f}'.replace(',','X').replace('.',',').replace('X','.')
for s in data['settlements']:
 c=canvas.Canvas(str(root/'public/statements'/f"{s['id']}.pdf"),pagesize=(595.28,841.89))
 c.setTitle('TipMarket - Extrato de '+s['period']);c.setAuthor('TipMarket Partners - demonstracao')
 c.setFillColor(HexColor('#17202e'));c.rect(0,735,596,107,fill=1,stroke=0)
 c.setFillColor(HexColor('#c6f477'));c.setFont('Helvetica-Bold',24);c.drawString(42,794,'tipmarket.')
 c.setFillColor(HexColor('#d3dbe6'));c.setFont('Helvetica',10);c.drawString(42,765,'PORTAL DO AFILIADO / EXTRATO DEMONSTRATIVO')
 c.setFillColor(HexColor('#202a3a'));c.setFont('Helvetica-Bold',23);c.drawString(42,688,s['period'])
 c.setFont('Helvetica',11);c.setFillColor(HexColor('#768194'));c.drawString(42,665,'Afiliado AF7K2Q  |  '+data['statusLabels'][s['status']]+'  |  USD')
 c.setFillColor(HexColor('#edf5e5'));c.roundRect(42,576,511,62,8,fill=1,stroke=0)
 c.setFillColor(HexColor('#56723f'));c.setFont('Helvetica',10);c.drawString(58,615,'COMISSAO ESTIMADA (PREVIA)' if s['status'] in ['OPEN','AWAITING'] else 'COMISSAO DEVIDA')
 c.setFont('Helvetica-Bold',24);c.drawString(58,587,fmt(s['due']))
 rows=[('NGR base',s['ngr']),('Revenue share (30%)',s['revshare']),(f"CPA ({s['qualified']} qualificados x US$ 10)",s['cpa']),('Saldo a compensar de entrada',s['carryIn']),('Ajustes - categoria comercial',s['adjustment']),('Saldo a compensar de saida',s['carryOut'])]
 y=542
 for label,val in rows:
  c.setFont('Helvetica',11);c.setFillColor(HexColor('#738091'));c.drawString(42,y,label)
  c.setFont('Helvetica-Bold',11);c.setFillColor(HexColor('#202a3a'));c.drawRightString(552,y,fmt(val))
  c.setStrokeColor(HexColor('#e6eaee'));c.line(42,y-12,552,y-12);y-=34
 y-=12;c.setFont('Helvetica-Bold',12);c.drawString(42,y,'Pagamentos registrados');y-=25
 if not s['payments']:
  c.setFont('Helvetica',11);c.setFillColor(HexColor('#738091'));c.drawString(42,y,'Nenhum pagamento registrado para este periodo.');y-=30
 else:
  for p in s['payments']:
   c.setFont('Helvetica-Bold',12);c.drawString(42,y,fmt(p['amount']));y-=21;c.setFont('Helvetica',10)
   c.drawString(42,y,p['date']+' | '+p['method']);y-=20;c.drawString(42,y,'Referencia: '+p['reference']);y-=35
 if s['carryOut']<0:
  text='A receita liquida deste periodo foi negativa. A comissao devida e zero. O saldo negativo sera compensado com resultados futuros antes de gerar um novo valor a pagar.'
  c.setFillColor(HexColor('#987b43'));c.setFont('Helvetica',10)
  for line in simpleSplit(text,'Helvetica',10,500):c.drawString(42,y,line);y-=15
 c.setStrokeColor(HexColor('#e1e6eb'));c.line(42,133,552,133)
 c.setFillColor(HexColor('#8794a4'));c.setFont('Helvetica',9);c.drawString(42,114,'Pagamento: USDC / Polygon / 0x7A2F********9B41. Para alterar, contate seu gerente.')
 c.drawString(42,90,'Dados ficticios para validacao local. Este documento nao comprova pagamento real.')
 c.drawString(42,75,'Valores abertos sao previas e dependem do fechamento financeiro.');c.drawRightString(552,42,'1 / 1')
 c.save()
qr=qrcode.make('otpauth://totp/TipMarket:DEMO?secret=JBSWY3DPEHPK3PXP&issuer=TipMarket',image_factory=qrcode.image.svg.SvgPathImage)
qr.save(str(root/'public/demo-totp.svg'))
print('5 PDFs e QR demonstrativo gerados.')

