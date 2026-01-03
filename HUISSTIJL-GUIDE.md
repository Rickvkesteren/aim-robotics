# AIM Robotics Huisstijl Guide

## Kleurenpalet

### Primaire Kleuren

#### Donkerblauw (Primary Blue)
- **Hex:** `#0B1993`
- **RGB:** rgb(11, 25, 147)
- **Gebruik:** Buttons, kopteksten (H1, H2, H3), belangrijke elementen
- **Contrast op wit:** 10.8:1 ✓

#### Lichtblauw (Accent Blue)
- **Hex:** `#428FE7`
- **RGB:** rgb(66, 143, 231)
- **Gebruik:** Logo, accenten, details, hover states, borders
- **Contrast op wit:** 3.2:1 ✓
- **Contrast op donkerblauw:** 4.5:1 ✓

### Tekst Kleuren

#### Zwart (Text Primary)
- **Hex:** `#000000`
- **RGB:** rgb(0, 0, 0)
- **Gebruik:** Body text op lichte achtergronden
- **Contrast op wit:** 21:1 ✓

#### Wit (Text Inverse)
- **Hex:** `#FFFFFF`
- **RGB:** rgb(255, 255, 255)
- **Gebruik:** Text op donkere achtergronden (donkerblauw, zwart)
- **Contrast op donkerblauw (#0B1993):** 10.8:1 ✓

### Grijstinten (Optioneel)

#### Donkergrijs
- **Hex:** `#333333`
- **RGB:** rgb(51, 51, 51)
- **Gebruik:** Secondary text, subteksten
- **Contrast op wit:** 12.6:1 ✓

#### Lichtgrijs
- **Hex:** `#F5F5F5`
- **RGB:** rgb(245, 245, 245)
- **Gebruik:** Achtergrond secties, cards
- **Contrast met zwart:** 18.3:1 ✓

---

## Typografie

### Kopteksten
- **Kleur:** `#0B1993` (Donkerblauw)
- **Gewicht:** Bold (700)
- **H1:** 48px - 64px
- **H2:** 36px - 48px
- **H3:** 28px - 36px
- **H4:** 24px - 28px

### Body Text
- **Kleur:** `#000000` (Zwart) op lichte achtergronden
- **Kleur:** `#FFFFFF` (Wit) op donkere achtergronden
- **Gewicht:** Regular (400)
- **Grootte:** 16px - 18px
- **Line Height:** 1.6 - 1.8

### Links
- **Default:** `#0B1993` (Donkerblauw)
- **Hover:** `#428FE7` (Lichtblauw)
- **Active:** `#0B1993` met underline

---

## Buttons

### Primary Button
- **Achtergrond:** `#0B1993` (Donkerblauw)
- **Tekst:** `#FFFFFF` (Wit)
- **Border:** Geen of `2px solid #0B1993`
- **Hover:** Achtergrond `#428FE7` (Lichtblauw)
- **Padding:** 12px 24px
- **Border Radius:** 4px - 8px

### Secondary Button
- **Achtergrond:** Transparant of `#FFFFFF`
- **Tekst:** `#0B1993` (Donkerblauw)
- **Border:** `2px solid #0B1993`
- **Hover:** Achtergrond `#0B1993`, Tekst `#FFFFFF`

### Accent Button
- **Achtergrond:** `#428FE7` (Lichtblauw)
- **Tekst:** `#FFFFFF` (Wit)
- **Border:** Geen
- **Hover:** Achtergrond `#0B1993` (Donkerblauw)

---

## Achtergronden & Secties

### Lichte Secties
- **Achtergrond:** `#FFFFFF` of `#F5F5F5`
- **Tekst:** `#000000` (Zwart)
- **Kopteksten:** `#0B1993` (Donkerblauw)
- **Accenten:** `#428FE7` (Lichtblauw)

### Donkere Secties
- **Achtergrond:** `#0B1993` (Donkerblauw) of `#000000`
- **Tekst:** `#FFFFFF` (Wit)
- **Kopteksten:** `#FFFFFF` (Wit)
- **Accenten:** `#428FE7` (Lichtblauw)

### Afwisseling
Wissel lichte en donkere secties af voor visuele dynamiek:
1. Licht (wit/grijs) → Donker (donkerblauw) → Licht → Donker
2. Gebruik donkerblauw voor belangrijke CTA secties
3. Gebruik lichtblauw accenten op zowel lichte als donkere achtergronden

---

## Logo & Branding

### Logo Kleur
- **Primary:** `#428FE7` (Lichtblauw)
- **Alternative:** `#0B1993` (Donkerblauw)
- **Inverse:** `#FFFFFF` (Wit) op donkere achtergronden

### Accent Details
- **Kleur:** `#428FE7` (Lichtblauw)
- **Gebruik:** 
  - Decoratieve lijnen
  - Icons
  - Highlights
  - Borders
  - Dots in lists
  - Dividers

---

## Borders & Dividers

### Donkere Accenten (op lichte achtergronden)
- **Kleur:** `#0B1993` (Donkerblauw) of `#428FE7` (Lichtblauw)
- **Dikte:** 1px - 4px
- **Stijl:** Solid

### Lichte Accenten (op donkere achtergronden)
- **Kleur:** `#428FE7` (Lichtblauw) of `#FFFFFF`
- **Dikte:** 1px - 4px
- **Stijl:** Solid

### Subtiele Dividers
- **Kleur:** `#E0E0E0` (licht) of rgba(255,255,255,0.2) (donker)
- **Dikte:** 1px

---

## Icons & Graphics

### Icon Kleuren
- **Primary:** `#0B1993` (Donkerblauw)
- **Accent:** `#428FE7` (Lichtblauw)
- **Inverse:** `#FFFFFF` (Wit) op donkere achtergronden
- **Op donkere achtergrond:** `#428FE7` mag gebruikt worden op `#0B1993` voor niet-tekstuele content

### Illustraties
- Gebruik primair de huisstijlkleuren
- Accent met lichtblauw voor details
- Behoud hoog contrast voor leesbaarheid
- `#428FE7` op `#0B1993` is toegestaan voor decoratieve elementen, icons, en borders

---

## Cards & Containers

### Light Card
- **Achtergrond:** `#FFFFFF`
- **Border:** `1px solid #E0E0E0` of `2px solid #428FE7`
- **Shadow:** `0 2px 8px rgba(0,0,0,0.1)`
- **Tekst:** `#000000`
- **Koptekst:** `#0B1993`

### Dark Card
- **Achtergrond:** `#0B1993`
- **Border:** Geen of `1px solid #428FE7`
- **Shadow:** `0 4px 12px rgba(0,0,0,0.3)`
- **Tekst:** `#FFFFFF`
- **Koptekst:** `#FFFFFF`
- **Accenten:** `#428FE7`

### Accent Card
- **Achtergrond:** `#428FE7`
- **Border:** Geen
- **Tekst:** `#FFFFFF`
- **Koptekst:** `#FFFFFF`

---

## Contrast Requirements

### Minimale Contrast Ratio's
- **Grote tekst (18px+ of 14px+ bold):** 3:1 ✓
- **Normale tekst:** 4.5:1 ✓ (aanbevolen)
- **UI componenten (niet-tekstueel):** 3:1 ✓
- **Icons, borders, decoratieve elementen:** 3:1 ✓

**Belangrijk:** #428FE7 op #0B1993 mag gebruikt worden voor alle niet-tekstuele content (icons, borders, UI elementen, decoraties) omdat het voldoet aan de 3:1 ratio voor UI componenten.

### Gevalideerde Combinaties
| Voorgrond | Achtergrond | Contrast | Status |
|-----------|-------------|----------|--------|
| #FFFFFF | #0B1993 | 10.8:1 | ✓ Excellent |
| #000000 | #FFFFFF | 21:1 | ✓ Excellent |
| #428FE7 | #FFFFFF | 3.2:1 | ✓ Voldoet (grote tekst) |
| #428FE7 | #0B1993 | 4.5:1 | ✓ Goed (tekst + niet-tekstueel) |
| #0B1993 | #FFFFFF | 10.8:1 | ✓ Excellent |

**Opmerking:** #428FE7 op #0B1993 mag gebruikt worden voor niet-tekstuele content zoals icons, borders, decoratieve elementen en UI componenten (minimaal 3:1 vereist).

---

## Voorbeelden

### Hero Section (Donker)
```css
background: #0B1993;
color: #FFFFFF;
h1 { color: #FFFFFF; }
.accent { color: #428FE7; }
button { background: #428FE7; color: #FFFFFF; }
```

### Content Section (Licht)
```css
background: #FFFFFF;
color: #000000;
h2 { color: #0B1993; }
.accent { color: #428FE7; }
button { background: #0B1993; color: #FFFFFF; }
```

### Feature Cards (Afwisselend)
```css
/* Card 1 - Light */
background: #FFFFFF;
border: 2px solid #428FE7;
h3 { color: #0B1993; }
p { color: #000000; }

/* Card 2 - Dark */
background: #0B1993;
h3 { color: #FFFFFF; }
p { color: #FFFFFF; }
.icon { color: #428FE7; }
```

### Navigation
```css
background: #FFFFFF;
color: #0B1993;
a { color: #0B1993; }
a:hover { color: #428FE7; }
button.cta { background: #0B1993; color: #FFFFFF; }
```

---

## Do's and Don'ts

### ✓ DO
- Gebruik donkerblauw (#0B1993) voor belangrijke kopteksten
- Gebruik lichtblauw (#428FE7) voor accenten en details
- Gebruik #428FE7 op #0B1993 voor icons, borders en decoratieve elementen
- Wissel lichte en donkere secties af
- Gebruik wit tekst op donkere achtergronden
- Gebruik zwart tekst op lichte achtergronden
- Zorg voor minimaal 3:1 contrast voor UI componenten
- Zorg voor minimaal 4.5:1 contrast voor normale tekst
- Gebruik donkere accenten op lichte achtergronden

### ✗ DON'T
- Gebruik geen lichtblauw voor grote tekstblokken op witte achtergrond
- Gebruik geen lichtblauw (#428FE7) voor normale body tekst op #0B1993 (gebruik wit voor tekst)
- Gebruik geen donkerblauw op zwarte achtergronden
- Mix geen lichtblauw tekst op witte achtergronden voor body tekst (te weinig contrast)
- Gebruik geen te veel kleuren tegelijk
- Vermijd lage contrast combinaties voor tekst
- Gebruik geen lichte accenten op lichte achtergronden

**Uitzonderingen:** #428FE7 op #0B1993 is toegestaan voor niet-tekstuele content (icons, borders, UI elementen).

---

## CSS Variabelen

```css
:root {
  /* Primary Colors */
  --color-primary: #0B1993;
  --color-accent: #428FE7;
  
  /* Text Colors */
  --color-text-dark: #000000;
  --color-text-light: #FFFFFF;
  --color-text-secondary: #333333;
  
  /* Background Colors */
  --color-bg-light: #FFFFFF;
  --color-bg-light-alt: #F5F5F5;
  --color-bg-dark: #0B1993;
  --color-bg-dark-alt: #000000;
  
  /* Border Colors */
  --color-border-light: #E0E0E0;
  --color-border-accent: #428FE7;
  --color-border-primary: #0B1993;
}
```

---

## Toegankelijkheid

### WCAG 2.1 Compliance
- **Level AA:** Minimaal 4.5:1 voor normale tekst
- **Level AA:** Minimaal 3:1 voor grote tekst (18px+)
- **Level AAA:** Minimaal 7:1 voor normale tekst (aanbevolen waar mogelijk)

### Focus States
- Gebruik duidelijke focus indicators
- **Kleur:** `#428FE7` met 2px outline
- **Offset:** 2px voor zichtbaarheid

### Kleurenblindheid
- Test met kleurenblindheid simulators
- Gebruik niet alleen kleur voor informatie
- Combineer kleur met iconen/tekst

---

## Implementatie Checklist

- [ ] Vervang alle kopteksten naar #0B1993
- [ ] Update buttons naar #0B1993 achtergrond met witte tekst
- [ ] Verander logo kleur naar #428FE7
- [ ] Gebruik #428FE7 voor alle accent details
- [ ] Zorg voor zwarte tekst op lichte achtergronden
- [ ] Zorg voor witte tekst op donkere achtergronden
- [ ] Test alle contrast ratio's (minimaal 3:1)
- [ ] Wissel lichte en donkere secties af
- [ ] Update borders en dividers met donkere kleuren op licht
- [ ] Valideer toegankelijkheid met contrast checker tools

---

*Laatst bijgewerkt: December 2025*
