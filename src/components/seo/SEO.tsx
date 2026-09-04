import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string;
  noindex?: boolean;
}

const SITE_URL = 'https://agenciaracun.com';
const DEFAULT_IMAGE =
  'https://storage.googleapis.com/gpt-engineer-file-uploads/826kJMydi0aEjiHRsP2wIyRlxSi1/uploads/1770766619976-Weddings_(Foto_de_perfil_para_Instagram).png';

/**
 * Per-route SEO head. Sets title, description, canonical and OG/Twitter tags.
 * Use on every public page; pass a stable canonical `path` (e.g. "/marketing").
 */
const SEO = ({ title, description, path, type = 'website', image, noindex }: SEOProps) => {
  const url = `${SITE_URL}${path}`;
  const img = image || DEFAULT_IMAGE;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
};

export default SEO;