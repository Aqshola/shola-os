# Blog App Plan

## Overview
Create Blog app to display posts from PocketBase

## PocketBase Collection Schema

### Collection: posts
| Field | Type | Description |
|-------|------|-------------|
| title | text | Post title |
| slug | text | URL-friendly identifier |
| excerpt | short summary |
| content | editor | Rich text content |
| thumbnail | file | Cover image |
| author | text | Author name |
| status | select | draft / published |
| created | autodate | Created timestamp |
| updated | autodate | Updated timestamp |

## Features

### Blog Window
- List of published posts
- Show thumbnail, title, excerpt
- Click to open post

### Post Window
- Full post content
- Title, author, date
- Rich text rendering (innerHTML)

### Deep Linking
- URL param `blog_slug=<slug>` opens specific post
- Opening post updates URL with `blog_slug=<slug>`

## Tasks

### To Do
- [ ] Create feature branch
- [ ] Create posts service (getList, getBySlug)
- [ ] Create useBlog hook (fetch posts, fetch by slug)
- [ ] Create BlogWindow component
- [ ] Create PostWindow component
- [ ] Add deep linking (blog_slug param)
- [ ] Add to Start menu
- [ ] Test & verify
- [ ] Commit & push