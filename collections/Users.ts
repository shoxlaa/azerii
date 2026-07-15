import type { CollectionConfig } from 'payload';

/**
 * Users — admin panel accounts (email + password auth).
 * A logged-in user is required to access /admin.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Only authenticated users can read the user list.
    read: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
};
