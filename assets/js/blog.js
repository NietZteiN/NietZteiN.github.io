// Markdown blog: renders the post list and individual posts inside #postsContent.
//
// Data flow:
//   blog/index.json  ->  list view  (grouped by year, one card per post)
//   blog/posts/*.md  ->  post view  (marked -> DOMPurify -> highlight.js + KaTeX)
//
// Routing is hash-based so posts are linkable and the back button works:
//   #/blog            -> list
//   #/post/<slug>     -> a single post
// Non-blog hashes are ignored, so the site's other nav links are untouched.

(function () {
	'use strict';

	var INDEX_URL = 'blog/index.json';
	var POSTS_DIR = 'blog/posts/';
	var TAG_CLASSES = ['t-purple', 't-lime', 't-sky'];

	var HLJS_LIGHT =
		'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css';
	var HLJS_DARK =
		'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css';

	var indexPromise = null;

	function loadIndex() {
		if (!indexPromise) {
			indexPromise = fetch(INDEX_URL, { cache: 'no-cache' })
				.then(function (r) {
					return r.ok ? r.json() : [];
				})
				.catch(function () {
					return [];
				});
		}
		return indexPromise;
	}

	function escapeHtml(s) {
		return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
			return {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
			}[c];
		});
	}

	function formatDate(iso) {
		if (!iso) return '';
		var parts = String(iso).split('-');
		if (parts.length < 3) return iso;
		var d = new Date(Date.UTC(+parts[0], +parts[1] - 1, +parts[2]));
		if (isNaN(d.getTime())) return iso;
		return d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC',
		});
	}

	function views() {
		return {
			list: document.getElementById('blogListView'),
			post: document.getElementById('blogPostView'),
		};
	}

	// ---- List view -------------------------------------------------------

	function tagsHtml(tags) {
		if (!tags || !tags.length) return '';
		var spans = tags
			.map(function (t, i) {
				return (
					'<span class="tag ' +
					TAG_CLASSES[i % TAG_CLASSES.length] +
					'">' +
					escapeHtml(t) +
					'</span>'
				);
			})
			.join(' ');
		return '<div class="blog-tags mt-2">' + spans + '</div>';
	}

	function cardHtml(p) {
		return (
			'<div class="blog-card mb-3" data-slug="' +
			escapeHtml(p.slug) +
			'">' +
			'<div class="blog-info">' +
			escapeHtml(formatDate(p.date)) +
			'</div>' +
			'<div class="lucida-console h5 mb-1">' +
			escapeHtml(p.title) +
			'</div>' +
			'<div class="blog-short">' +
			escapeHtml(p.summary || '') +
			'</div>' +
			tagsHtml(p.tags) +
			'</div>'
		);
	}

	function renderListView() {
		var v = views();
		if (!v.list || !v.post) return;
		v.post.style.display = 'none';
		v.post.innerHTML = '';

		loadIndex().then(function (posts) {
			if (!posts.length) {
				v.list.innerHTML = '<p class="mt-2">No posts yet.</p>';
				v.list.style.display = '';
				return;
			}

			var byYear = {};
			posts.forEach(function (p) {
				var year = (p.date || '').slice(0, 4) || '—';
				(byYear[year] = byYear[year] || []).push(p);
			});

			var years = Object.keys(byYear).sort().reverse();
			var html = '';
			years.forEach(function (year) {
				html += '<div class="row mt-3"><h2 class="pub-year-h2">' + escapeHtml(year) + '</h2>';
				byYear[year].forEach(function (p) {
					html += cardHtml(p);
				});
				html += '</div>';
			});
			v.list.innerHTML = html;
			v.list.style.display = '';
		});
	}

	// ---- Post view -------------------------------------------------------

	// Split a raw .md file into { fm, body }, parsing simple front matter.
	function parsePost(text) {
		var fm = {};
		var body = text;
		var m = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/.exec(text);
		if (m) {
			body = text.slice(m[0].length);
			m[1].split(/\r?\n/).forEach(function (line) {
				var idx = line.indexOf(':');
				if (idx === -1) return;
				var key = line.slice(0, idx).trim();
				var val = line.slice(idx + 1).trim();
				if (val.charAt(0) === '[' && val.charAt(val.length - 1) === ']') {
					fm[key] = val
						.slice(1, -1)
						.split(',')
						.map(function (s) {
							return s.trim().replace(/^["']|["']$/g, '');
						})
						.filter(Boolean);
				} else {
					fm[key] = val.replace(/^["']|["']$/g, '');
				}
			});
		}
		return { fm: fm, body: body };
	}

	function decorate(container) {
		if (window.hljs) {
			container.querySelectorAll('pre code').forEach(function (el) {
				try {
					window.hljs.highlightElement(el);
				} catch (e) {
					/* ignore */
				}
			});
		}
		if (window.renderMathInElement) {
			try {
				window.renderMathInElement(container, {
					delimiters: [
						{ left: '$$', right: '$$', display: true },
						{ left: '$', right: '$', display: false },
						{ left: '\\(', right: '\\)', display: false },
						{ left: '\\[', right: '\\]', display: true },
					],
					throwOnError: false,
				});
			} catch (e) {
				/* ignore */
			}
		}
	}

	function renderPostView(slug) {
		var v = views();
		if (!v.list || !v.post) return;

		loadIndex().then(function (posts) {
			var meta = null;
			for (var i = 0; i < posts.length; i++) {
				if (posts[i].slug === slug) {
					meta = posts[i];
					break;
				}
			}
			var file = meta ? meta.file : slug + '.md';

			return fetch(POSTS_DIR + file, { cache: 'no-cache' })
				.then(function (r) {
					if (!r.ok) throw new Error('not found');
					return r.text();
				})
				.then(function (text) {
					var parsed = parsePost(text);
					var title = (meta && meta.title) || parsed.fm.title || slug;
					var date = formatDate((meta && meta.date) || parsed.fm.date);
					var rawHtml = window.marked.parse(parsed.body);
					var clean = window.DOMPurify.sanitize(rawHtml);

					v.list.style.display = 'none';
					v.post.innerHTML =
						'<p class="mb-3"><a href="#/blog" class="link-dark blog-back">← Back to posts</a></p>' +
						'<h1 class="blog-post-title">' +
						escapeHtml(title) +
						'</h1>' +
						(date ? '<div class="blog-info mb-4">' + escapeHtml(date) + '</div>' : '') +
						'<div class="blog-post-body">' +
						clean +
						'</div>';
					v.post.style.display = '';

					decorate(v.post.querySelector('.blog-post-body'));
					window.scrollTo({ top: 0, behavior: 'auto' });
				})
				.catch(function () {
					v.list.style.display = 'none';
					v.post.innerHTML =
						'<p class="mb-3"><a href="#/blog" class="link-dark blog-back">← Back to posts</a></p>' +
						'<p>Sorry, that post could not be found.</p>';
					v.post.style.display = '';
				});
		});
	}

	// ---- Section activation + routing -----------------------------------

	// Make the Blog section the visible one (mirrors main.js nav behavior).
	function openBlogSection() {
		if (typeof window.clearActiveLinks === 'function') window.clearActiveLinks();
		$('#posts').addClass('active');
		$('#leftPanel').show();
		if (typeof window.clearActiveDivs === 'function') window.clearActiveDivs();
		if (typeof window.activateDiv === 'function') {
			window.activateDiv('#postsContent');
		} else {
			$('#postsContent').addClass('active').show();
		}
	}

	function applyRoute() {
		var h = window.location.hash || '';
		var mp = /^#\/post\/(.+)$/.exec(h);
		if (mp) {
			openBlogSection();
			renderPostView(decodeURIComponent(mp[1]));
			return;
		}
		if (h === '#/blog' || h === '#/blog/') {
			openBlogSection();
			renderListView();
			return;
		}
		// Any other hash: not ours — leave the rest of the site alone.
	}

	// Sync the highlight.js stylesheet to the active theme.
	function setHljsTheme(isDark) {
		var link = document.getElementById('hljs-theme');
		if (link) link.href = isDark ? HLJS_DARK : HLJS_LIGHT;
	}

	// Public API used by main.js.
	window.Blog = {
		applyRoute: applyRoute,
		setHljsTheme: setHljsTheme,
		HLJS_LIGHT: HLJS_LIGHT,
		HLJS_DARK: HLJS_DARK,
	};

	$(function () {
		if (window.marked && window.marked.setOptions) {
			window.marked.setOptions({ gfm: true, breaks: false });
		}

		// Clicking a card navigates to the post (delegated: cards are dynamic).
		$(document).on('click', '.blog-card', function () {
			var slug = $(this).data('slug');
			if (slug) window.location.hash = '#/post/' + encodeURIComponent(slug);
		});

		window.addEventListener('hashchange', applyRoute);

		// Honor a deep link on first load (e.g. someone opened #/post/hello-world).
		applyRoute();
	});
})();
