const Listing = require('../../models/Listing');
const ProjectPost = require('../../models/ProjectPost');
const Paginate = require('../../utils/paginate');
const { memoryCache } = require('../../utils/cache');

// GET /api/buyer/marketplace?project_type=&country=&min_price=&max_price=
async function browseMarketplace(req, res) {
  try {
    const cacheKey = `marketplace_browse_${JSON.stringify(req.query)}`;
    const cachedData = memoryCache.get(cacheKey);

    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
      return res.status(200).json(cachedData);
    }

    const { project_type, country, min_price, max_price } = req.query;
    const filters = {};
    if (project_type) filters.project_type = project_type;
    if (country) filters.country = country;
    if (min_price) filters.min_price = Number(min_price);
    if (max_price) filters.max_price = Number(max_price);

    const { page, limit, offset } = Paginate.getPagination(req.query);

    const { rows, total } = await Listing.findActiveListings(filters, { limit, offset });
    const responseData = {
      success: true,
      message: 'Active Listing Fetch Successfully',
      ...Paginate.paginatedResponse(rows, total, page, limit),
    };

    memoryCache.set(cacheKey, responseData, 30);
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
    return res.status(200).json(responseData);
  } catch (err) {
    console.error('Browse marketplace error:', err);
    res.status(500).json({ error: 'Failed to fetch marketplace listings' });
  }
}

// GET /api/buyer/marketplace/:listingId
// Includes the project's public showcase post(s), if any, for a richer detail page
async function getListingDetails(req, res) {
  try {
    const cacheKey = `marketplace_listing_${req.params.listingId}`;
    const cachedData = memoryCache.get(cacheKey);

    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
      return res.json(cachedData);
    }

    const listing = await Listing.findListingPublicById(req.params.listingId);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const posts = await ProjectPost.findPostsByProject(listing.project_id);
    const responseData = { listing, showcase_posts: posts };

    memoryCache.set(cacheKey, responseData, 30);
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
    res.json(responseData);
  } catch (err) {
    console.error('Get listing details error:', err);
    res.status(500).json({ error: 'Failed to fetch listing details' });
  }
}

module.exports = { browseMarketplace, getListingDetails };