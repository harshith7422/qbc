import { Quotation } from '../types/quotation';

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'quot-001',
    referenceNumber: 'BCD-2026-0104',
    customer: {
      customerName: 'Rohit & Ananya Sharma',
      contactNumber: '+91 98450 12345',
      email: 'rohit.sharma@example.com',
      projectName: 'Prestige Lavender Villa 402',
      projectLocation: 'Whitefield, Bengaluru',
      quotationDate: '2026-02-14',
      referenceNumber: 'BCD-2026-0104'
    },
    rooms: [
      {
        id: 'qroom-1',
        roomId: 'room-kitchen',
        roomName: 'Kitchen',
        roomArea: 45,
        items: [
          {
            id: 'item-101',
            categoryId: 'cat-k-base',
            categoryName: 'Base Cabinet',
            subCategoryId: 'sub-k-base-1',
            subCategoryName: 'Acrylic',
            pricingType: 'fixed',
            ratePerSqFt: 1950,
            area: 45,
            basePrice: 87750,
            finalPrice: 94000,
            notes: 'Hettich soft-close tandem boxes and marine ply carcass'
          },
          {
            id: 'item-102',
            categoryId: 'cat-k-wall',
            categoryName: 'Wall Cabinet',
            subCategoryId: 'sub-k-wall-2',
            subCategoryName: 'Tinted Glass with Profile',
            pricingType: 'fixed',
            ratePerSqFt: 2600,
            area: 30,
            basePrice: 78000,
            finalPrice: 82000,
            notes: 'Bronze tinted glass with warm integrated profile lighting'
          },
          {
            id: 'item-103',
            categoryId: 'cat-k-counter',
            categoryName: 'Countertop',
            subCategoryId: 'sub-k-counter-1',
            subCategoryName: 'Granite / Quartz',
            pricingType: 'variable',
            ratePerSqFt: 1500,
            area: 45,
            basePrice: 67500,
            finalPrice: 72000,
            notes: 'Kalinga Stone Calacatta quartz with waterfall edge profiling'
          }
        ]
      },
      {
        id: 'qroom-2',
        roomId: 'room-bedroom',
        roomName: 'Master Bedroom',
        roomArea: 60,
        items: [
          {
            id: 'item-201',
            categoryId: 'cat-b-wardrobe',
            categoryName: 'Master Wardrobe',
            subCategoryId: 'sub-b-w-1',
            subCategoryName: 'Floor-to-Ceiling Acrylic',
            pricingType: 'fixed',
            ratePerSqFt: 2100,
            area: 60,
            basePrice: 126000,
            finalPrice: 135000,
            notes: 'Champagne gold edge profile handles and sensor LED lighting'
          },
          {
            id: 'item-202',
            categoryId: 'cat-b-dresser',
            categoryName: 'Dresser Unit',
            subCategoryId: 'sub-b-dr-2',
            subCategoryName: 'Fluted Panel with LED Backlight',
            pricingType: 'fixed',
            ratePerSqFt: 1950,
            area: 25,
            basePrice: 48750,
            finalPrice: 52000,
            notes: 'Full-height mirror with touch sensor dimmable backlight'
          }
        ]
      },
      {
        id: 'qroom-3',
        roomId: 'room-living',
        roomName: 'Living Room',
        roomArea: 55,
        items: [
          {
            id: 'item-301',
            categoryId: 'cat-l-tv',
            categoryName: 'TV Console & Feature Wall',
            subCategoryId: 'sub-l-tv-1',
            subCategoryName: 'Italian Fluted Panel Wall',
            pricingType: 'fixed',
            ratePerSqFt: 2350,
            area: 55,
            basePrice: 129250,
            finalPrice: 138000,
            notes: 'Dark walnut fluted panels with brushed gold metal inlay'
          },
          {
            id: 'item-302',
            categoryId: 'cat-l-ceiling',
            categoryName: 'False Ceiling',
            subCategoryId: 'sub-l-c-1',
            subCategoryName: 'Gypsum Board with Cove Light',
            pricingType: 'fixed',
            ratePerSqFt: 180,
            area: 65,
            basePrice: 11700,
            finalPrice: 12000,
            notes: 'Perimeter cove lighting'
          }
        ]
      }
    ],
    summary: {
      totalRooms: 3,
      totalItems: 7,
      totalBasePrice: 548950,
      totalFinalPrice: 585000,
      grandTotal: 585000
    },
    status: 'accepted',
    validityDays: 15,
    notes: 'Premium turnkey modular and architectural wall paneling package.',
    createdAt: '2026-02-14T10:30:00Z',
    updatedAt: '2026-02-16T14:20:00Z'
  },
  {
    id: 'quot-002',
    referenceNumber: 'BCD-2026-0112',
    customer: {
      customerName: 'Vikram Malhotra',
      contactNumber: '+91 97312 88410',
      email: 'vikram.m@techcorp.in',
      projectName: 'Sobha Dream Acres, C-1402',
      projectLocation: 'Balagere, Panathur, Bengaluru',
      quotationDate: '2026-02-18',
      referenceNumber: 'BCD-2026-0112'
    },
    rooms: [
      {
        id: 'qroom-21',
        roomId: 'room-kitchen',
        roomName: 'Kitchen',
        roomArea: 35,
        items: [
          {
            id: 'item-211',
            categoryId: 'cat-k-base',
            categoryName: 'Base Cabinet',
            subCategoryId: 'sub-k-base-2',
            subCategoryName: 'Laminate',
            pricingType: 'fixed',
            ratePerSqFt: 1400,
            area: 35,
            basePrice: 49000,
            finalPrice: 53000,
            notes: 'Matte grey anti-scratch laminate with SS 304 wire baskets'
          },
          {
            id: 'item-212',
            categoryId: 'cat-k-wall',
            categoryName: 'Wall Cabinet',
            subCategoryId: 'sub-k-wall-3',
            subCategoryName: 'Laminate',
            pricingType: 'fixed',
            ratePerSqFt: 1350,
            area: 35,
            basePrice: 47250,
            finalPrice: 50000,
            notes: 'G-profile handleless shutter system'
          },
          {
            id: 'item-213',
            categoryId: 'cat-k-tall',
            categoryName: 'Tall Unit',
            subCategoryId: 'sub-k-tall-1',
            subCategoryName: 'Pantry Pull-out',
            pricingType: 'fixed',
            ratePerSqFt: 2400,
            area: 20,
            basePrice: 48000,
            finalPrice: 52000,
            notes: '6-tier pantry pull-out mechanism'
          }
        ]
      },
      {
        id: 'qroom-22',
        roomId: 'room-wardrobe',
        roomName: 'Master Bedroom Wardrobe',
        roomArea: 50,
        items: [
          {
            id: 'item-221',
            categoryId: 'cat-w-sliding',
            categoryName: 'Sliding Wardrobe',
            subCategoryId: 'sub-w-s-1',
            subCategoryName: 'Lacquered Glass with Soft-close',
            pricingType: 'fixed',
            ratePerSqFt: 2650,
            area: 50,
            basePrice: 132500,
            finalPrice: 142000,
            notes: 'White lacquered glass with bronze anodized frame'
          },
          {
            id: 'item-222',
            categoryId: 'cat-bath-vanity',
            categoryName: 'Vanity Cabinet',
            subCategoryId: 'sub-bath-v-1',
            subCategoryName: 'Marine Ply with Acrylic Finish',
            pricingType: 'fixed',
            ratePerSqFt: 2100,
            area: 20,
            basePrice: 42000,
            finalPrice: 45000,
            notes: 'Wall-mounted floating counter'
          }
        ]
      }
    ],
    summary: {
      totalRooms: 2,
      totalItems: 5,
      totalBasePrice: 318750,
      totalFinalPrice: 342000,
      grandTotal: 342000
    },
    status: 'generated',
    validityDays: 15,
    notes: 'Modular compact 2BHK execution package.',
    createdAt: '2026-02-18T11:15:00Z',
    updatedAt: '2026-02-18T16:00:00Z'
  },
  {
    id: 'quot-003',
    referenceNumber: 'BCD-2026-0118',
    customer: {
      customerName: 'Dr. Kavita Rao',
      contactNumber: '+91 99001 55670',
      email: 'dr.kavita.rao@fortis.org',
      projectName: 'Godrej Eternity 3BHK',
      projectLocation: 'Kanakapura Road, Bengaluru',
      quotationDate: '2026-02-20',
      referenceNumber: 'BCD-2026-0118'
    },
    rooms: [
      {
        id: 'qroom-31',
        roomId: 'room-living',
        roomName: 'Living & Dining Room',
        roomArea: 70,
        items: [
          {
            id: 'item-311',
            categoryId: 'cat-l-tv',
            categoryName: 'TV Console & Feature Wall',
            subCategoryId: 'sub-l-tv-1',
            subCategoryName: 'Italian Fluted Panel Wall',
            pricingType: 'fixed',
            ratePerSqFt: 2350,
            area: 50,
            basePrice: 117500,
            finalPrice: 125000,
            notes: 'Warm beige fluted acoustic panels'
          },
          {
            id: 'item-312',
            categoryId: 'cat-l-partition',
            categoryName: 'Room Partition / Divider',
            subCategoryId: 'sub-l-p-1',
            subCategoryName: 'Metal Profile with Fluted Glass',
            pricingType: 'fixed',
            ratePerSqFt: 2900,
            area: 35,
            basePrice: 101500,
            finalPrice: 110000,
            notes: 'Sliding fluted glass screen separating living from dining'
          },
          {
            id: 'item-313',
            categoryId: 'cat-l-foyer',
            categoryName: 'Foyer & Shoe Unit',
            subCategoryId: 'sub-l-f-2',
            subCategoryName: 'Full Height Storage with Mirror',
            pricingType: 'fixed',
            ratePerSqFt: 1750,
            area: 30,
            basePrice: 52500,
            finalPrice: 56000,
            notes: 'Full height storage with hidden shoe drawers'
          }
        ]
      },
      {
        id: 'qroom-32',
        roomId: 'room-kitchen',
        roomName: 'Kitchen',
        roomArea: 40,
        items: [
          {
            id: 'item-321',
            categoryId: 'cat-k-base',
            categoryName: 'Base Cabinet',
            subCategoryId: 'sub-k-base-3',
            subCategoryName: 'PU Finish',
            pricingType: 'fixed',
            ratePerSqFt: 2200,
            area: 40,
            basePrice: 88000,
            finalPrice: 95000,
            notes: 'Sage green PU matte paint finish'
          },
          {
            id: 'item-322',
            categoryId: 'cat-k-wall',
            categoryName: 'Wall Cabinet',
            subCategoryId: 'sub-k-wall-1',
            subCategoryName: 'Acrylic',
            pricingType: 'fixed',
            ratePerSqFt: 1850,
            area: 40,
            basePrice: 74000,
            finalPrice: 79000,
            notes: 'Off-white acrylic wall cabinets'
          }
        ]
      }
    ],
    summary: {
      totalRooms: 2,
      totalItems: 5,
      totalBasePrice: 433500,
      totalFinalPrice: 465000,
      grandTotal: 465000
    },
    status: 'sent',
    validityDays: 15,
    notes: 'Sent to client via email for 3D walkthrough alignment.',
    createdAt: '2026-02-20T09:40:00Z',
    updatedAt: '2026-02-20T17:10:00Z'
  },
  {
    id: 'quot-004',
    referenceNumber: 'BCD-2026-0125',
    customer: {
      customerName: 'Aditya & Sneha Verma',
      contactNumber: '+91 96112 34900',
      email: 'aditya.verma@consultant.com',
      projectName: 'Assetz Marq 2.0, Tower 4',
      projectLocation: 'Kadugodi, Whitefield, Bengaluru',
      quotationDate: '2026-02-22',
      referenceNumber: 'BCD-2026-0125'
    },
    rooms: [
      {
        id: 'qroom-41',
        roomId: 'room-kitchen',
        roomName: 'Kitchen',
        roomArea: 30,
        items: [
          {
            id: 'item-411',
            categoryId: 'cat-k-base',
            categoryName: 'Base Cabinet',
            subCategoryId: 'sub-k-base-1',
            subCategoryName: 'Acrylic',
            pricingType: 'fixed',
            ratePerSqFt: 1950,
            area: 30,
            basePrice: 58500,
            finalPrice: 62000,
            notes: 'High gloss acrylic base'
          },
          {
            id: 'item-412',
            categoryId: 'cat-k-base',
            categoryName: 'Base Cabinet',
            subCategoryId: 'sub-k-base-2',
            subCategoryName: 'Laminate',
            pricingType: 'fixed',
            ratePerSqFt: 1400,
            area: 30,
            basePrice: 42000,
            finalPrice: 45000,
            notes: 'Laminate option comparison'
          },
          {
            id: 'item-413',
            categoryId: 'cat-k-counter',
            categoryName: 'Countertop',
            subCategoryId: 'sub-k-counter-1',
            subCategoryName: 'Granite / Quartz',
            pricingType: 'variable',
            ratePerSqFt: 1500,
            area: 30,
            basePrice: 45000,
            finalPrice: 48000,
            notes: 'Quartz countertop with sink cutout'
          }
        ]
      }
    ],
    summary: {
      totalRooms: 1,
      totalItems: 3,
      totalBasePrice: 145500,
      totalFinalPrice: 155000,
      grandTotal: 155000
    },
    status: 'draft',
    validityDays: 15,
    notes: 'Draft under initial site inspection discussion.',
    createdAt: '2026-02-22T14:00:00Z',
    updatedAt: '2026-02-22T14:35:00Z'
  }
];
