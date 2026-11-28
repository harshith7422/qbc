import { MasterPricingCatalog } from '../types/pricing';

export const INITIAL_PRICING_CATALOG: MasterPricingCatalog = {
  globalBaseRate: 1500,
  lastUpdated: new Date().toISOString(),
  rooms: [
    {
      id: 'room-kitchen',
      name: 'Kitchen',
      categories: [
        {
          id: 'cat-k-base',
          name: 'Base Cabinet',
          subCategories: [
            { id: 'sub-k-base-1', name: 'Acrylic', pricingType: 'fixed', rate: 1950, description: 'Anti-scratch high-gloss acrylic finish with waterproof BWR ply carcass' },
            { id: 'sub-k-base-2', name: 'Laminate', pricingType: 'fixed', rate: 1400, description: '1mm premium suede/matte laminate finish with PVC edge banding' },
            { id: 'sub-k-base-3', name: 'PU Finish', pricingType: 'fixed', rate: 2200, description: 'Seamless polyurethane paint finish in custom RAL shades' },
            { id: 'sub-k-base-4', name: 'Membrane', pricingType: 'fixed', rate: 1650, description: 'Seamless thermo-foil membrane finish with sculpted grooved edges' }
          ]
        },
        {
          id: 'cat-k-counter',
          name: 'Countertop',
          subCategories: [
            { id: 'sub-k-counter-1', name: 'Granite / Quartz', pricingType: 'fixed', rate: 2200, description: 'Selected premium slab rate evaluated per square footage based on benchmark' }
          ]
        },
        {
          id: 'cat-k-wall',
          name: 'Wall Cabinet',
          subCategories: [
            { id: 'sub-k-wall-1', name: 'Acrylic', pricingType: 'fixed', rate: 1850, description: 'Top cabinetry with matching high gloss finish and gas-lift stays' },
            { id: 'sub-k-wall-2', name: 'Tinted Glass with Profile', pricingType: 'fixed', rate: 2600, description: 'Grey/bronze tinted toughened glass in slim anodized aluminum frame' },
            { id: 'sub-k-wall-3', name: 'Laminate', pricingType: 'fixed', rate: 1350, description: 'Durable matching interior laminate' }
          ]
        },
        {
          id: 'cat-k-tall',
          name: 'Tall Unit',
          subCategories: [
            { id: 'sub-k-tall-1', name: 'Pantry Pull-out', pricingType: 'fixed', rate: 2400, description: 'Full extension 6-tier heavy gauge wire basket pantry organizer' },
            { id: 'sub-k-tall-2', name: 'Built-in Appliance Carcass', pricingType: 'fixed', rate: 2100, description: 'Microwave and oven cavity unit with heat dissipation channels' }
          ]
        },
        {
          id: 'cat-k-loft',
          name: 'Loft Cabinet',
          subCategories: [
            { id: 'sub-k-loft-1', name: 'Laminate Finish', pricingType: 'fixed', rate: 1200, description: 'Ceiling touching loft storage with touch-latch hardware' },
            { id: 'sub-k-loft-2', name: 'Acrylic Finish', pricingType: 'fixed', rate: 1600, description: 'Coordinated acrylic finish for continuous architectural line' }
          ]
        }
      ]
    },
    {
      id: 'room-bedroom',
      name: 'Bedroom',
      categories: [
        {
          id: 'cat-b-wardrobe',
          name: 'Master Wardrobe',
          subCategories: [
            { id: 'sub-b-w-1', name: 'Floor-to-Ceiling Acrylic', pricingType: 'fixed', rate: 2100, description: 'Seamless seamless 8.5ft hinged wardrobe with premium soft-close' },
            { id: 'sub-b-w-2', name: 'Premium Textured Laminate', pricingType: 'fixed', rate: 1550, description: 'Fluted / linen-weave matte laminate finish' },
            { id: 'sub-b-w-3', name: 'Tinted Glass with Black Profile', pricingType: 'fixed', rate: 2800, description: 'Boutique look wardrobe with integrated warm 3000K vertical LED channels' },
            { id: 'sub-b-w-4', name: 'PU Lacquer High Gloss', pricingType: 'fixed', rate: 2400, description: 'Ultra-luxurious Italian PU lacquer coating' }
          ]
        },
        {
          id: 'cat-b-bed',
          name: 'Bed with Storage',
          subCategories: [
            { id: 'sub-b-bed-1', name: 'Hydraulic Lift King Bed', pricingType: 'fixed', rate: 1650, description: 'High-lift gas-spring mechanism with generous dust-free sub-bed storage' },
            { id: 'sub-b-bed-2', name: 'Headboard Cushioning & Paneling', pricingType: 'fixed', rate: 1800, description: 'Upholstered suede/velvet acoustic padding with brass inlays' }
          ]
        },
        {
          id: 'cat-b-dresser',
          name: 'Dresser Unit',
          subCategories: [
            { id: 'sub-b-dr-1', name: 'Veneer with Warm Polish', pricingType: 'fixed', rate: 2300, description: 'Natural teak/walnut veneer polished with clear matte polyurethane' },
            { id: 'sub-b-dr-2', name: 'Fluted Panel with LED Backlight', pricingType: 'fixed', rate: 1950, description: 'Modern vertical ribbed wall paneling with full-length vanity mirror' }
          ]
        },
        {
          id: 'cat-b-tv',
          name: 'TV Wall Unit',
          subCategories: [
            { id: 'sub-b-tv-1', name: 'Floating Console with Drawer', pricingType: 'fixed', rate: 1750, description: 'Sleek concealed wire routing console' },
            { id: 'sub-b-tv-2', name: 'Feature Wall Cladding', pricingType: 'fixed', rate: 1850, description: 'Custom wall accents and acoustic fabric / marble finish' }
          ]
        }
      ]
    },
    {
      id: 'room-living',
      name: 'Living Room',
      categories: [
        {
          id: 'cat-l-tv',
          name: 'TV Console & Feature Wall',
          subCategories: [
            { id: 'sub-l-tv-1', name: 'Italian Fluted Panel Wall', pricingType: 'fixed', rate: 2350, description: 'Charcoal/oak fluted back paneling with warm cove lighting' },
            { id: 'sub-l-tv-2', name: 'Floating Storage Console', pricingType: 'fixed', rate: 1800, description: 'Mitred edge drawers with quartz stone top' },
            { id: 'sub-l-tv-3', name: 'Stone / Quartz Cladding Backdrop', pricingType: 'variable', rate: 0, description: 'Seamless large format bookmatched porcelain/stone slab' }
          ]
        },
        {
          id: 'cat-l-foyer',
          name: 'Foyer & Shoe Unit',
          subCategories: [
            { id: 'sub-l-f-1', name: 'Bench with Sitter & Shoe Rack', pricingType: 'fixed', rate: 1600, description: 'Cushioned seating ledge with lower ventilated pull-outs' },
            { id: 'sub-l-f-2', name: 'Full Height Storage with Mirror', pricingType: 'fixed', rate: 1750, description: 'Entryway key drop ledge and tall shoe organizer' }
          ]
        },
        {
          id: 'cat-l-partition',
          name: 'Room Partition / Divider',
          subCategories: [
            { id: 'sub-l-p-1', name: 'Metal Profile with Fluted Glass', pricingType: 'fixed', rate: 2900, description: 'Floor to ceiling slim aluminum partition in champagne gold' },
            { id: 'sub-l-p-2', name: 'Wooden Rafters Screen', pricingType: 'fixed', rate: 1900, description: 'Solid hardwood rafters spaced at regular geometric intervals' }
          ]
        },
        {
          id: 'cat-l-ceiling',
          name: 'False Ceiling',
          subCategories: [
            { id: 'sub-l-c-1', name: 'Gypsum Board with Cove Light', pricingType: 'fixed', rate: 180, description: 'Saint-Gobain gypsum channel grid with Philips LED cove channel' },
            { id: 'sub-l-c-2', name: 'Perimeter Wooden Ceiling Inset', pricingType: 'fixed', rate: 420, description: 'Warm wooden veneer border with recessed magnetic track lights' }
          ]
        }
      ]
    },
    {
      id: 'room-wardrobe',
      name: 'Wardrobe',
      categories: [
        {
          id: 'cat-w-sliding',
          name: 'Sliding Wardrobe',
          subCategories: [
            { id: 'sub-w-s-1', name: 'Lacquered Glass with Soft-close', pricingType: 'fixed', rate: 2650, description: 'Premium top-hung sliding mechanism with zero bottom floor track' },
            { id: 'sub-w-s-2', name: 'Anti-scratch Laminate', pricingType: 'fixed', rate: 1600, description: 'Heavy-duty smooth glide 2-door / 3-door slider system' }
          ]
        },
        {
          id: 'cat-w-walkin',
          name: 'Walk-in Closet',
          subCategories: [
            { id: 'sub-w-w-1', name: 'Open Shelf Profile System', pricingType: 'fixed', rate: 2400, description: 'European floor-to-ceiling aluminum stanchion system with modular boxes' },
            { id: 'sub-w-w-2', name: 'Wooden Carcass with Sensor Lights', pricingType: 'fixed', rate: 2100, description: 'Internal jewelry organizers, valet trays, and sensor LED rods' }
          ]
        }
      ]
    },
    {
      id: 'room-bathroom',
      name: 'Bathroom',
      categories: [
        {
          id: 'cat-bath-vanity',
          name: 'Vanity Cabinet',
          subCategories: [
            { id: 'sub-bath-v-1', name: 'Marine Ply with Acrylic Finish', pricingType: 'fixed', rate: 2100, description: '100% waterproof 710-grade boiling waterproof ply with acrylic' },
            { id: 'sub-bath-v-2', name: 'Water-resistant Laminate', pricingType: 'fixed', rate: 1600, description: 'High pressure laminate with polyurethane sealed edges' }
          ]
        },
        {
          id: 'cat-bath-mirror',
          name: 'Mirror Cabinet',
          subCategories: [
            { id: 'sub-bath-m-1', name: 'Medicine Cabinet with Touch LED', pricingType: 'fixed', rate: 1850, description: 'Concealed shelving with defogger mirror and perimeter backlight' }
          ]
        }
      ]
    },
    {
      id: 'room-custom',
      name: 'Custom Room',
      isCustom: true,
      categories: [
        {
          id: 'cat-c-storage',
          name: 'Custom Storage & Millwork',
          subCategories: [
            { id: 'sub-c-1', name: 'Standard Modular Unit', pricingType: 'fixed', rate: 1500, description: 'Custom sized storage configured to site specifications' },
            { id: 'sub-c-2', name: 'Architectural Feature Work', pricingType: 'fixed', rate: 1600, description: 'Specialized bespoke carpentry using high-grade plywood' }
          ]
        }
      ]
    }
  ]
};
