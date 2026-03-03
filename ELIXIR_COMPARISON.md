# Next.js → Elixir Phoenix Comparison

A side-by-side guide for someone coming from this Next.js stack.

## Quick Command Equivalents

| Next.js | Phoenix |
|---------|---------|
| `npx create-next-app` | `mix phx.new myapp` |
| `npm run dev` | `mix phx.server` |
| `npm run build` | `mix compile` |
| `npm install <pkg>` | Add to `mix.exs` deps, then `mix deps.get` |
| `npx next build && npx next start` | `MIX_ENV=prod mix release` |

## Project Structure

```
NEXT.JS                              PHOENIX
───────                              ───────
package.json                         mix.exs              (deps & project config)
next.config.ts                       config/              (app config files)
node_modules/                        deps/                (downloaded dependencies)
public/                              priv/static/         (static assets)

src/app/                             lib/myapp_web/
  layout.tsx                           components/layouts/app.html.heex
  page.tsx                             controllers/page_controller.ex
  globals.css                          (use Tailwind the same way)

src/app/items/                       lib/myapp_web/
  page.tsx                             controllers/item_controller.ex
  _components/items-table.tsx          controllers/item_html.ex
                                       controllers/item_html/
                                         index.html.heex
                                         new.html.heex
                                         edit.html.heex
                                         show.html.heex
  _lib/types.ts                      lib/myapp/item.ex         (Ecto schema)
  _lib/store.ts                      lib/myapp/items.ex        (context module)
  _lib/actions.ts                    lib/myapp_web/controllers/item_controller.ex
```

## File Type Mapping

| Next.js | Phoenix | What it does |
|---------|---------|-------------|
| `.tsx` / `.jsx` | `.ex` | Backend logic (controllers, schemas, contexts) |
| `.tsx` (JSX markup) | `.html.heex` | Templates / HTML with embedded code |
| TypeScript types | Ecto schema + changeset | Data shape & validation |
| Server Actions (`"use server"`) | Controller actions | Handle form submissions |
| `layout.tsx` | `app.html.heex` | Root wrapper layout |
| `page.tsx` | `index.html.heex` + controller | A routable page |
| CSS / Tailwind | CSS / Tailwind | Same — Phoenix ships with Tailwind too |

## Routing

**Next.js** — file-based (folder = route):
```
src/app/items/page.tsx           → GET /items
src/app/items/create/page.tsx    → GET /items/create
src/app/items/[id]/edit/page.tsx → GET /items/:id/edit
```

**Phoenix** — explicit in `router.ex`:
```elixir
# lib/myapp_web/router.ex
scope "/", MyappWeb do
  pipe_through :browser

  get "/", PageController, :home
  resources "/items", ItemController    # generates ALL crud routes at once
end
```

`resources "/items"` generates these routes automatically:

| HTTP Method | Path | Controller Action | Next.js Equivalent |
|-------------|------|-------------------|-------------------|
| GET | `/items` | `:index` | `app/items/page.tsx` |
| GET | `/items/new` | `:new` | `app/items/create/page.tsx` |
| POST | `/items` | `:create` | Server Action `createItem()` |
| GET | `/items/:id` | `:show` | `app/items/[id]/page.tsx` |
| GET | `/items/:id/edit` | `:edit` | `app/items/[id]/edit/page.tsx` |
| PATCH/PUT | `/items/:id` | `:update` | Server Action `updateItem()` |
| DELETE | `/items/:id` | `:delete` | Server Action `deleteItem()` |

## CRUD Side-by-Side

### Data Schema / Types

**Next.js** (`types.ts`):
```typescript
export type Item = {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
};
```

**Phoenix** (`lib/myapp/item.ex`):
```elixir
defmodule Myapp.Item do
  use Ecto.Schema
  import Ecto.Changeset

  schema "items" do
    field :name, :string
    field :description, :string
    field :status, :string, default: "active"
    timestamps()                          # auto adds inserted_at, updated_at
  end

  def changeset(item, attrs) do
    item
    |> cast(attrs, [:name, :description, :status])
    |> validate_required([:name])         # built-in validation (like Zod)
  end
end
```

### Data Access / Store

**Next.js** (`store.ts` / would be Prisma/Drizzle):
```typescript
export function getAll(): Item[] { ... }
export function create(data): Item { ... }
```

**Phoenix** (`lib/myapp/items.ex` — called a "context"):
```elixir
defmodule Myapp.Items do
  alias Myapp.Repo
  alias Myapp.Item

  def list_items,            do: Repo.all(Item)
  def get_item!(id),         do: Repo.get!(Item, id)
  def create_item(attrs),    do: %Item{} |> Item.changeset(attrs) |> Repo.insert()
  def update_item(item, attrs), do: item |> Item.changeset(attrs) |> Repo.update()
  def delete_item(item),     do: Repo.delete(item)
end
```

### Server Actions → Controller Actions

**Next.js** (`actions.ts`):
```typescript
"use server";
export async function createItem(formData: FormData) {
  store.create({ name: formData.get("name"), ... });
  revalidatePath("/items");
}
```

**Phoenix** (`item_controller.ex`):
```elixir
defmodule MyappWeb.ItemController do
  use MyappWeb, :controller
  alias Myapp.Items

  def index(conn, _params) do
    items = Items.list_items()
    render(conn, :index, items: items)
  end

  def new(conn, _params) do
    changeset = Items.change_item(%Item{})
    render(conn, :new, changeset: changeset)
  end

  def create(conn, %{"item" => item_params}) do
    case Items.create_item(item_params) do
      {:ok, item} ->
        conn
        |> put_flash(:info, "Item created.")
        |> redirect(to: ~p"/items/#{item}")

      {:error, changeset} ->
        render(conn, :new, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    item = Items.get_item!(id)
    Items.delete_item(item)

    conn
    |> put_flash(:info, "Item deleted.")
    |> redirect(to: ~p"/items")
  end
end
```

### Templates (JSX → HEEx)

**Next.js** (JSX in `.tsx`):
```tsx
<table>
  {items.map((item) => (
    <tr key={item.id}>
      <td>{item.name}</td>
      <td>{item.status}</td>
    </tr>
  ))}
</table>
```

**Phoenix** (`index.html.heex`):
```heex
<table>
  <tr :for={item <- @items}>
    <td><%= item.name %></td>
    <td><%= item.status %></td>
    <td>
      <.link navigate={~p"/items/#{item}"}>View</.link>
      <.link navigate={~p"/items/#{item}/edit"}>Edit</.link>
      <.link href={~p"/items/#{item}"} method="delete" data-confirm="Are you sure?">
        Delete
      </.link>
    </td>
  </tr>
</table>
```

## Concern-by-Concern: Why Next.js Has More Files

Same concepts, split differently. Phoenix feels "cleaner" because the framework provides more built-in.

| Concern | Phoenix | Next.js | Why the difference |
|---|---|---|---|
| List page | `index.ex` + `index.html.heex` | `page.tsx` (1 file) | Next.js merges backend + template |
| Show page | `show.ex` + `show.html.heex` | `[id]/page.tsx` (1 file) | Same |
| New page | `new.ex` + `new.html.heex` | `new/page.tsx` (1 file) | Same |
| Edit page | `edit.ex` + `edit.html.heex` | `[id]/edit/page.tsx` (1 file) | Same |
| Form component | `form_component.ex` | `product-form.tsx` | Direct equivalent |
| Schema/types | `product.ex` | `types.ts` | Direct equivalent |
| Context/logic | `products.ex` | `store.ts` | Direct equivalent |
| Validations | Inside `product.ex` changeset | `validate.ts` (separate file) | No changeset equivalent — must split out |
| Actions/events | Inside each LiveView `handle_event` | `actions.ts` (separate file) | `"use server"` needs own module boundary |
| Flash messages | Built into Phoenix | `flash.tsx` (manual) | Not provided by Next.js |
| Delete confirm | Built-in / JS hook | `delete-button.tsx` (manual) | Not provided by Next.js |

## Key Concept Mapping

| Concept | Next.js | Phoenix |
|---------|---------|---------|
| Language | TypeScript | Elixir |
| Runtime | Node.js (V8) | BEAM VM (Erlang VM) |
| Package manager | npm / pnpm | mix + hex |
| ORM | Prisma / Drizzle | Ecto |
| Validation | Zod (manual) | Ecto Changeset (built-in) |
| Templating | JSX (in same file) | HEEx (separate `.html.heex` files) |
| Reactivity / Live UI | React (client JS) | LiveView (server-driven, no JS needed) |
| CSS | Tailwind | Tailwind (ships by default) |
| Auth | NextAuth / Auth.js | `mix phx.gen.auth` (built-in generator) |
| Deployment | Vercel / Docker | Fly.io / Docker / bare release |

## The Big Difference: LiveView

Phoenix has **LiveView** — real-time interactive UIs driven entirely from the server. No React, no client JS bundles.

- In Next.js, you need `"use client"` components + React state for interactivity
- In Phoenix LiveView, the server holds the state and pushes HTML diffs over WebSocket

This means the modal + table interactivity in our CRUD template would need zero client-side JavaScript in Phoenix LiveView. The server handles it all.

## Generator Shortcut

Phoenix can scaffold an entire CRUD in one command:

```bash
mix phx.gen.html Items Item items name:string description:string status:string
```

This generates: schema, migration, context, controller, templates, and tests — ready to use.

The Next.js equivalent would be... this template you're looking at right now. Copy the folder, rename, done.
