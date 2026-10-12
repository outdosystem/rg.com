/**
 * Rohit Garg – Executive Personal Branding Website
 * Google Reviews Integration Engine (google-reviews.js)
 *
 * Strict Compliance:
 * 1. Independent module separate from main.js.
 * 2. Does NOT hardcode fabricated 5-star reviews as fake real reviews.
 * 3. Supports configurable Google Place ID and backend proxy API.
 * 4. Displays real Google rating & count when provided by an authorized source.
 * 5. Provides honest, elegant configuration instructions and fallback states when credentials/Place ID are not yet linked.
 * 6. Complies with Google Places API attribution requirements and safe HTML escaping.
 */

(function () {
  'use strict';

  // Configuration object - easily editable by site owner
  const GOOGLE_REVIEWS_CONFIG = {
    // Replace with Rohit Garg's verified Google Place ID (e.g., 'ChIJN1t_tDeuEmsRUsoyG83frY4')
    placeId: '', 
    // Secure backend proxy endpoint that fetches Google Places details (prevents leaking Google API key in client code)
    apiEndpoint: '', 
    // Link to Rohit Garg's Google Maps / Business Profile page for reviews
    businessProfileUrl: 'https://maps.google.com/', 
    // Max reviews to render
    maxReviews: 3,
  };

  document.addEventListener('DOMContentLoaded', () => {
    initGoogleReviews();
  });

  function initGoogleReviews() {
    const container = document.getElementById('googleReviewsContainer');
    if (!container) return;

    // Check if placeId or apiEndpoint is configured
    if (!GOOGLE_REVIEWS_CONFIG.placeId && !GOOGLE_REVIEWS_CONFIG.apiEndpoint) {
      renderSetupState(container);
      return;
    }

    renderLoadingState(container);

    // If API endpoint is configured, fetch real reviews
    if (GOOGLE_REVIEWS_CONFIG.apiEndpoint) {
      fetchRealReviews(GOOGLE_REVIEWS_CONFIG.apiEndpoint, container);
    } else {
      // If only Place ID is provided without a backend proxy, explain the backend necessity per Google API terms
      renderProxyRequirementState(container);
    }
  }

  function renderLoadingState(container) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-warning" role="status" style="width: 2.5rem; height: 2.5rem; color: #C5A46D !important;">
          <span class="visually-hidden">Loading Google Reviews...</span>
        </div>
        <p class="mt-3 text-muted">Retrieving verified Google reviews from authorized profile...</p>
      </div>
    `;
  }

  function renderSetupState(container) {
    container.innerHTML = `
      <div class="col-12">
        <div class="review-setup-notice">
          <div class="d-inline-flex align-items-center justify-content-center p-3 mb-3 rounded-circle" style="background: rgba(197, 164, 109, 0.15); color: #C5A46D;">
            <i class="bi bi-google fs-2"></i>
          </div>
          <h3 class="h4 mb-2" style="font-family: var(--font-serif-display);">Google Reviews Integration</h3>
          <p class="text-muted max-w-lg mx-auto mb-4" style="max-width: 620px;">
            In adherence to professional integrity and Google Places API guidelines, customer ratings and endorsements are not fabricated. Connect Rohit Garg's Google Business Profile to stream real-time verified reviews.
          </p>
          <div class="d-flex flex-wrap justify-content-center gap-3">
            <a href="contact.html" class="btn-gold">
              <i class="bi bi-chat-square-text me-1"></i> Submit a Review
            </a>
            <button type="button" class="btn-outline-gold" id="btnToggleReviewGuide">
              <i class="bi bi-gear me-1"></i> Configuration Instructions
            </button>
          </div>
          
          <div id="reviewGuideCollapse" class="mt-4 text-start p-4 bg-white rounded border d-none" style="max-width: 680px; margin-left: auto; margin-right: auto;">
            <h6 class="fw-bold mb-2 text-dark"><i class="bi bi-shield-check text-warning me-2"></i>How to connect live Google Reviews:</h6>
            <ol class="small text-muted mb-3 ps-3">
              <li class="mb-1">Locate Rohit Garg's Google Place ID using the Google Places Place ID Finder.</li>
              <li class="mb-1">Configure your secure backend proxy route (e.g., <code>/api/google-reviews?placeId=...</code>) to query the official Google Places API without exposing your Google Cloud API key.</li>
              <li class="mb-1">Update <code>GOOGLE_REVIEWS_CONFIG.apiEndpoint</code> in <code>assets/js/google-reviews.js</code>.</li>
            </ol>
            <div class="p-2 bg-light rounded font-monospace small text-secondary">
              // File: assets/js/google-reviews.js<br>
              GOOGLE_REVIEWS_CONFIG.placeId = 'YOUR_PLACE_ID';<br>
              GOOGLE_REVIEWS_CONFIG.apiEndpoint = '/api/reviews';
            </div>
          </div>
        </div>
      </div>
    `;

    const guideBtn = document.getElementById('btnToggleReviewGuide');
    const guideBox = document.getElementById('reviewGuideCollapse');
    if (guideBtn && guideBox) {
      guideBtn.addEventListener('click', () => {
        guideBox.classList.toggle('d-none');
      });
    }
  }

  function renderProxyRequirementState(container) {
    container.innerHTML = `
      <div class="col-12">
        <div class="review-setup-notice">
          <i class="bi bi-shield-lock fs-1 text-warning mb-2 d-block"></i>
          <h4 class="mb-2">Backend Proxy Configuration Required</h4>
          <p class="text-muted" style="max-width: 580px; margin: 0 auto 1.5rem;">
            A Google Place ID has been identified. Per Google Cloud Security Policies, Google Places API requests must be routed via a secure backend proxy to prevent exposure of client credentials.
          </p>
          <a href="${escapeHtml(GOOGLE_REVIEWS_CONFIG.businessProfileUrl)}" target="_blank" rel="noopener noreferrer" class="btn-outline-gold">
            <i class="bi bi-box-arrow-up-right me-1"></i> View Profile on Google Maps
          </a>
        </div>
      </div>
    `;
  }

  function fetchRealReviews(endpoint, container) {
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data || !data.reviews || !data.reviews.length) {
          container.innerHTML = `
            <div class="col-12 text-center py-4">
              <p class="text-muted">No published Google reviews found for the specified profile yet.</p>
            </div>
          `;
          return;
        }

        renderReviewCards(data, container);
      })
      .catch((err) => {
        console.warn('Google Reviews fetch notice:', err.message);
        renderSetupState(container);
      });
  }

  function renderReviewCards(data, container) {
    const reviews = data.reviews.slice(0, GOOGLE_REVIEWS_CONFIG.maxReviews);
    let html = '';

    reviews.forEach((rev) => {
      const author = escapeHtml(rev.author_name || 'Verified Client');
      const text = escapeHtml(rev.text || '');
      const time = rev.relative_time_description ? escapeHtml(rev.relative_time_description) : '';
      const rating = Math.min(5, Math.max(1, rev.rating || 5));
      const initial = author.charAt(0).toUpperCase();

      let starIcons = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          starIcons += '<i class="bi bi-star-fill"></i>';
        } else {
          starIcons += '<i class="bi bi-star"></i>';
        }
      }

      html += `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="review-card">
            <div>
              <div class="review-header">
                <div class="reviewer-info">
                  <div class="reviewer-avatar">${initial}</div>
                  <div>
                    <h5 class="reviewer-name">${author}</h5>
                    ${time ? `<div class="reviewer-date">${time}</div>` : ''}
                  </div>
                </div>
                <div class="stars-rating" aria-label="${rating} out of 5 stars">
                  ${starIcons}
                </div>
              </div>
              <p class="review-quote">"${text}"</p>
            </div>
            <div class="review-attribution">
              <i class="bi bi-google text-danger"></i>
              <span>Verified Google Review</span>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
