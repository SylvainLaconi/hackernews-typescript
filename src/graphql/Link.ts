import { extendType, intArg, idArg, nonNull, nullable, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id"),
    t.nonNull.string("description"),
    t.nonNull.string("url")
  },
});

let links: NexusGenObjects["Link"][]= [
  {
    id: 1,
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  },
  {
    id: 2,
    url: "graphql.org",
    description: "GraphQL official website"
  }
];

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, context, info) {
        return links
      }
    }),
    t.field("feedById", {
      type: "Link",
      args: {
        id: nonNull(intArg())
      },

      resolve(parent, args, context, info) {
        const {id} = args;

        const link = links.find((link) => link.id === Number(id));

        return link ? link : null
      }
    })
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg())
      },

      resolve(parent, args, context, info) {
        const {description, url} = args;

        let idCount = links.length + 1;

        const link = {
          id: idCount,
          description: description,
          url: url
        };

        links.push(link);

        return link
      }
    }),
    t.field("update", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
        description: nullable(stringArg()),
        url: nullable(stringArg())
      },

      resolve(parent, args, context, info) {
        const {id, description, url} = args;

        let link = links.find((link) => link.id === Number(id));

        if(!link){
          return null
        }
        else {
          links = links.filter((link) => link.id !== Number(id));

          if(description) {
            link.description = description;
          }
          if(url) {
            link.url = url
          }
          links.push(link)
        }
        return link
      }
    }),
    t.field("delete", {
      type: "Link",
      args: {
        id: nonNull(intArg())
      },
      resolve(parent, args, context, info) {
        const {id} = args;

        let link = links.find((link) => link.id === Number(id));

        if(!link){
          return null
        }
        else {
          links = links.filter((link) => link.id !== Number(id));
        }
        return link
      }
    })
  },
});