# F1rst Motors–Inspired Full Website Redesign

## Goal
Redesign the complete Luxury Car Gallery website around the reference’s polished, cinematic showroom experience. The result will closely follow its composition, spacing, typography, image treatment, navigation behavior, and monochrome luxury character while retaining Luxury Car Gallery’s own logo, inventory, wording, contact information, and search metadata.

## Visual direction
- Move from the current classic white, brass, serif presentation to a crisp black, white, and cool-grey system with a restrained red brand accent.
- Use a modern automotive sans-serif throughout, with wide uppercase labels and large, tightly controlled display headings.
- Replace decorative borders and traditional styling with broad image-led sections, soft tonal transitions, minimal controls, and generous whitespace.
- Introduce the reference’s pill-shaped calls to action, compact icon controls, precise micro-interactions, and smooth section entrances.
- Keep imagery sharp and prominent; no copied F1rst Motors logos, wording, photos, or proprietary assets.

## Site-wide structure
### Header and navigation
- Build a slim light header with the Luxury Car Gallery logo centered.
- Place a Menu trigger on the left and search/contact controls on the right, matching the reference’s balanced geometry.
- Replace the current dropdown with a full-screen premium menu containing Inventory, About, Sell Your Car, and Contact, plus direct phone and WhatsApp access.
- Add a compact mobile treatment with the same hierarchy and accessible open/close behavior.

### Footer
- Recompose the footer as a spacious dark information area with the logo, showroom details, inventory shortcuts, brand links, selling links, and contact actions.
- Simplify the existing dense brand-count presentation and retain only useful, working destinations.

## Homepage
- Preserve the existing showroom video but restyle it as a full-screen cinematic opening feature with one featured vehicle message and one focused action.
- Follow with an immersive showroom story section using the existing interior image, bold oversized title, restrained copy, and key business figures.
- Replace the boxed marque grid with a clean horizontal/flowing brand showcase based on the marques actually in stock.
- Present featured vehicles as large editorial image tiles, with names, years, prices, and availability surfaced consistently.
- Add a dark, image-led action grid for Available Cars, New Arrivals, Sell Your Car, and Contact rather than unsupported reference features.
- Finish with a strong enquiry panel instead of adding a non-functional newsletter form.

## Inventory
- Replace the existing short photo banner and form-like selects with a cleaner showroom catalogue introduction and compact filter bar.
- Restyle vehicle cards around larger photography, minimal metadata, prominent prices, and subtle image movement.
- Keep all current filters and sorting behavior, improve active-filter clarity, and preserve empty results and mobile usability.

## Vehicle pages
- Retain the current vehicle-specific SEO, Open Graph, and structured data.
- Restyle the opening gallery into the same cinematic language: large controlled image stage, discreet count/arrows, and a polished full-screen viewer.
- Integrate the existing fixed image mosaic more seamlessly or replace it with a compact editorial preview that does not create excessive page length.
- Redesign title, price, primary details, enquiry actions, specifications, and related vehicles using the reference’s sharp typography and dark/light section rhythm.
- Preserve keyboard gallery controls, WhatsApp, phone, and email actions.

## About, Sell, and Contact
- Give each page a full-width visual introduction rather than the current simple text-first layout.
- About: showroom-led brand story, key figures, and a clear inventory action.
- Sell: premium valuation journey with concise benefits and the existing WhatsApp/email handoff.
- Contact: showroom-focused information, large direct-contact actions, location details, and appointment messaging.

## Content and search visibility
- Keep all 21 existing vehicles and their local image galleries unchanged.
- Preserve route-specific titles, descriptions, Open Graph fields, canonical links, and vehicle structured data.
- Rewrite only short presentation copy where needed to fit the new composition; retain the current Dubai positioning and contact details.
- Keep image alternative text, semantic heading order, keyboard controls, reduced-motion support, and readable contrast.

## Technical implementation
- Consolidate the new colors, typography, spacing, controls, and motion into semantic global design tokens.
- Refactor shared header, footer, vehicle card, gallery, and page-introduction patterns so all pages remain visually consistent.
- Use the existing TanStack routes and fixed source inventory; no database or account system will be added.
- Verify every route at desktop and mobile sizes, including menu behavior, inventory filtering, vehicle gallery/lightbox, enquiry links, overflow, console errors, and metadata output.

## Intended page flow
```text
Compact centered header
        ↓
Cinematic vehicle/showroom feature
        ↓
Showroom story and figures
        ↓
Marques and featured inventory
        ↓
Primary customer actions
        ↓
Dark information-rich footer
```
