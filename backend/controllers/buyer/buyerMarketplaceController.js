const Listing = require('../../models/Listing');
const ProjectPost = require('../../models/ProjectPost');

// GET /api/buyer/marketplace?project_type=&country=&min_price=&max_price=
async function browseMarketplace(req, res) {
  try {
    const { project_type, country, min_price, max_price } = req.query;
    const filters = {};
    if (project_type) filters.project_type = project_type;
    if (country) filters.country = country;
    if (min_price) filters.min_price = Number(min_price);
    if (max_price) filters.max_price = Number(max_price);

    const listings = await Listing.findActiveListings(filters);
    res.json({ listings });
  } catch (err) {
    console.error('Browse marketplace error:', err);
    res.status(500).json({ error: 'Failed to fetch marketplace listings' });
  }
}

// GET /api/buyer/marketplace/:listingId
// Includes the project's public showcase post(s), if any, for a richer detail page
async function getListingDetails(req, res) {
  try {
    const listing = await Listing.findListingPublicById(req.params.listingId);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const posts = await ProjectPost.findPostsByProject(listing.project_id);
    res.json({ listing, showcase_posts: posts });
  } catch (err) {
    console.error('Get listing details error:', err);
    res.status(500).json({ error: 'Failed to fetch listing details' });
  }
}

module.exports = { browseMarketplace,getListingDetails  };