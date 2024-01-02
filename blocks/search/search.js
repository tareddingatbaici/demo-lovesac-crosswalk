import { getMetadata, createOptimizedPicture } from '../../scripts/lib-franklin.js';
import createTag from '../../scripts/tag.js';

function clearSearchInput(searchInput) {
  searchInput.value = '';
  const inputEvent = new Event('input', { bubbles: true, cancelable: true });
  searchInput.dispatchEvent(inputEvent);
}

function decorateSearchBar(label) {
  const searchBar = createTag('aside', { id: 'search-bar', class: 'search-bar' });
  const searchField = createTag('div', { class: 'search-field' }, '');
  const searchInput = createTag('input', { class: 'search-input', placeholder: label });
  const searchResults = createTag('div', { class: 'search-results' });

  const clearButton = createTag('button', { class: 'clear-results-button' }, '✕');
  clearButton.addEventListener('click', (e) => {
    e.preventDefault();
    clearSearchInput(searchInput);
  });
  searchField.append(clearButton);

  searchInput.addEventListener('input', (e) => {
    onSearchInput(e.target.value, searchResults);
  });

  searchField.append(searchInput);
  searchBar.append(searchField, searchResults);
  return searchBar;
}

async function fetchBlogArticleIndex() {
  const index = '/query-index.json';
  const resp = await fetch(index);
  const json = await resp.json();
  const lookup = {};
  json.data.forEach((row) => {
    lookup[row.path] = row;
  });
  return { data: json.data, lookup };
}

function decorateCard(hit) {
  const {
    title, description, image,
  } = hit;
  const path = hit.path.split('.')[0];
  const picture = createOptimizedPicture(image, title, false, [{ width: '750' }]);
  const pictureTag = picture.outerHTML;
  const html = `<div class="article-card-image">${pictureTag}</div>
      <div class="article-card-body">
        <h3>${title}</h3>
        <p>${description}</p>
      </div>`;
  return createTag('a', { href: path, class: 'article-card' }, html);
}

function highlightTextElements(terms, elements) {
  elements.forEach((e) => {
    const matches = [];
    const txt = e.textContent;
    terms.forEach((term) => {
      const offset = txt.toLowerCase().indexOf(term);
      if (offset >= 0) {
        matches.push({ offset, term });
      }
    });
    matches.sort((a, b) => a.offset - b.offset);
    let markedUp = '';
    if (!matches.length) markedUp = txt;
    else {
      markedUp = txt.substr(0, matches[0].offset);
      matches.forEach((hit, i) => {
        markedUp += `<mark class="gnav-search-highlight">${txt.substr(hit.offset, hit.term.length)}</mark>`;
        if (matches.length - 1 === i) {
          markedUp += txt.substr(hit.offset + hit.term.length);
        } else {
          markedUp += txt.substring(hit.offset + hit.term.length, matches[i + 1].offset);
        }
      });
      e.innerHTML = markedUp;
    }
  });
}

async function populateSearchResults(searchTerms, resultsContainer) {
  const limit = 12;
  const terms = searchTerms.toLowerCase().split(' ').map((e) => e.trim()).filter((e) => !!e);
  resultsContainer.innerHTML = '';

  if (terms.length) {
    if (!window.blogIndex) {
      window.blogIndex = await fetchBlogArticleIndex();
    }

    const articles = window.blogIndex.data;

    const hits = [];
    let i = 0;
    for (; i < articles.length; i += 1) {
      const e = articles[i];
      const text = [e.title, e.content].join(' ').toLowerCase();

      if (terms.every((term) => text.includes(term))) {
        if (hits.length === limit) {
          break;
        }
        hits.push(e);
      }
    }

    hits.forEach((hit) => {
      const card = decorateCard(hit);
      resultsContainer.appendChild(card);
    });

    if (!hits.length) {
      resultsContainer.classList.add('no-Results');
      nav.classList.remove('in-search');
    } else {
      resultsContainer.classList.remove('no-Results');
      nav.classList.add('in-search');
    }

    highlightTextElements(terms, resultsContainer.querySelectorAll('h3, .article-card-category, .article-card-body > p'));
  }
}

function onSearchInput(value, resultsContainer, advancedLink) {
  populateSearchResults(value, resultsContainer);
  if (advancedLink) {
    const href = new URL(advancedLink.href);
    href.searchParams.set('q', value);
    advancedLink.href = href.toString();
  }
}
function decorateSearch(searchDiv) {
  const label = searchDiv.querySelector('p').textContent;
  const searchEl = createTag('div', { class: 'customSearch' });
  const searchBar = decorateSearchBar(label);
  searchEl.append(searchBar);
  searchDiv.append(searchEl);
}

export default async function decorate(block) {
  try {
    const enableSearch = getMetadata('enable-search');
    if (!enableSearch || enableSearch !== 'no') {
      const div = createTag('div', { class: 'search' });
      div.innerHTML = '<p>Search</p>';
      decorateSearch(div);
      block.append(div);
    }
  } catch (e) {
    block.innerHTML = e
  }
}