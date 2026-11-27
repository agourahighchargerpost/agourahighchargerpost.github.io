# Charger Post editor guide

Articles are published from the online editor at
**https://www.agourahighchargerpost.com/admin/**.
Nothing to install; it works in any browser.

---

## One-time setup (each editor)

You need a GitHub account with access to the newspaper's site repository,
[agourahighchargerpost/agourahighchargerpost.github.io](https://github.com/agourahighchargerpost/agourahighchargerpost.github.io).

1. **Create a GitHub account** at https://github.com/signup if you don't have one.
2. **Get added to the newspaper:** ask the site owner to add your GitHub username (see *Adding a new editor* below), then accept the invitation GitHub emails you.
3. **Make an access token** (a password just for the editor):
   1. Open this link while signed in to GitHub:
      **https://github.com/settings/tokens/new?scopes=public_repo&description=Charger%20Post%20editor**
      It opens a "New personal access token (classic)" page with the right box (*public_repo*) already ticked.
   2. **Expiration:** pick *No expiration*, or a date at the end of the school year.
   3. Scroll down, click **Generate token**, and copy the long code that starts with `ghp_`.
4. **Sign in to the editor:** go to https://www.agourahighchargerpost.com/admin/, click **Sign In Using Access Token**, paste the code, and click **Sign In**.
   (Ignore the link in that box to a "fine-grained" token. Those don't work for this site; use the link in step 3.)

Your browser remembers you after this. You only repeat steps 3–4 if you switch computers or browsers, or when the token expires.

> Keep the token private, like a password. If it leaks, delete it at
> https://github.com/settings/personal-access-tokens and make a new one.

---

## Publishing an article from a Google Doc

1. Open the editor, click **Articles**, then **New Article**.
2. Fill in the boxes:

   | Box | What to put |
   | --- | --- |
   | **Headline** | The article title. It also becomes the web address (e.g. `/spring-musical-opens-friday/`). |
   | **Publish date** | Already set to right now. Change it only to backdate an article. |
   | **Writer** | Start typing their name. New writer? Click **Create new** right there, or add them under **Writers** first. |
   | **Co-writers** | Optional. Anyone else who wrote the article. It's listed on their writer page too. |
   | **Sections** | One or more: News, Feature, Opinion, Sports, Arts and Entertainment. |
   | **Tags** | Optional keywords, such as the writer's first name or the topic. |
   | **Featured photo** | The main photo at the top of the article and in lists. Click to upload. Big phone photos are shrunk automatically. |
   | **Featured photo description** | A few words describing the photo, for readers who use screen readers. |
   | **Article** | The article text. See below. |
   | **Summary** | Optional. Leave blank to use the first 55 words of the article. |

3. **Copying the text from Google Docs:**
   1. In the Google Doc, select the article text. Leave out the headline and byline; those go in their own boxes.
   2. Copy (**Ctrl+C** / **⌘C**) and paste into the **Article** box (**Ctrl+V** / **⌘V**).
      Bold, italics, headings, links, lists and centered text are kept.
   3. **Photos inside the article:** delete any photos that came along in the paste. They still live on Google's servers and can stop working later. Instead, put your cursor where the photo goes and click the **image** button in the toolbar to upload it. There you can also add a caption, such as a photo credit.
      To get the photos out of a Google Doc: **File → Download → Web page (.html, zipped)**, then unzip it. The images are in the `images` folder.
4. Click **Save**. The article is live on the website in about **1–2 minutes**.

### Saving without publishing

Turn on **Draft (hide from the website)** before saving. The article is stored but not shown anywhere on the site. Turn it off and save again when it's ready.

### Preview

After saving, the editor shows a link to the article's page on the live site (it works once the 1–2 minute update is done).

---

## Other things you can do

- **Fix or update an article:** Articles → click it → edit → Save.
- **Delete an article:** open it and choose **Delete**. This removes it from the website. (To hide it temporarily instead, turn on **Draft**.)
- **Add or edit a writer's profile** (photo, bio, email): **Writers**. Each writer has a page at `/author/their-name/` listing their articles.
- **Choose the two stories beside the homepage banner:** **Site settings → Homepage**. Leave it empty to show two random articles on every visit, which is what the old site did. The big rotating banner always shows the 4 newest articles automatically.

The homepage, section pages, tag pages, monthly archives, "Recent Posts", search, and writer pages all update by themselves whenever you save.

---

## If something goes wrong

- **The site didn't update after a few minutes:** open the site's repository on GitHub and click the **Actions** tab. A red ✗ next to your change means the update failed. Click it to see why, or ask the site owner.
- **"Not Found" or permission error when signing in:** you may not have accepted the invitation to the repository yet (check your email or https://github.com/agourahighchargerpost/agourahighchargerpost.github.io/invitations), or the token is missing the *public_repo* box or has expired. Make a new one (one-time setup, step 3).
- **Undo a mistake:** every save is recorded on GitHub. The site owner can restore any earlier version of any article from the repository's history.

---

## For the site owner: adding a new editor

1. Sign in to GitHub as **agourahighchargerpost**, open the [site repository](https://github.com/agourahighchargerpost/agourahighchargerpost.github.io) → **Settings → Collaborators** → **Add people**, and enter their GitHub username.
2. Send them this guide. They need to accept the emailed invitation before they can sign in.

When an editor leaves the paper, remove them from **Settings → Collaborators**. Their access ends immediately.
