import "server-only";

import { prisma } from "../prisma";

type RouteRecord = Awaited<ReturnType<typeof prisma.route.findMany>>[number];

export type RouteTreeNode = RouteRecord & {
  children: RouteTreeNode[];
};

type GetRouteTreeOptions = {
  topLevelOnly?: boolean;
};

export async function getRouteTree(options: GetRouteTreeOptions = {}): Promise<RouteTreeNode[]> {
  const { topLevelOnly = false } = options;

  const routes = await prisma.route.findMany();

  const childrenByParent = new Map<number, RouteRecord[]>();

  for (const route of routes) {
    if (route.parentId !== null) {
      const children = childrenByParent.get(route.parentId) ?? [];
      children.push(route);
      childrenByParent.set(route.parentId, children);
    }
  }

  function buildTree(route: RouteRecord): RouteTreeNode {
    const children = childrenByParent.get(route.id) ?? [];

    return {
      ...route,
      children: topLevelOnly ? [] : children.map(buildTree),
    };
  }

  return routes.filter((route) => route.parentId === null).map(buildTree);
}

