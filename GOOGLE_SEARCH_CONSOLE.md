# Google Search Console setup

The site now exposes `https://tytandoor.com/robots.txt` and `https://tytandoor.com/sitemap.xml`.

To finish ownership verification, sign in to [Google Search Console](https://search.google.com/search-console), add the **Domain** property `tytandoor.com`, and add the DNS TXT record Google provides at the DNS host. Domain verification covers both `tytandoor.com` and `admin.tytandoor.com` without putting a verification token in source control.

After verification, submit `https://tytandoor.com/sitemap.xml` in **Sitemaps**. Do not submit the admin subdomain.
