import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";

import { renderWithIntl, screen, waitFor } from "@/test/renderWithIntl";
import { db, reflectionDB } from "@/lib/db/indexedDB";
import ReflectionField from "./ReflectionField";

beforeEach(async () => {
  await db.reflections.clear();
});

const field = () => screen.getByRole("textbox", { name: /what went well/i });

describe("ReflectionField", () => {
  it("starts empty on a day with nothing written", async () => {
    renderWithIntl(<ReflectionField />);

    await waitFor(() => expect(field()).toHaveValue(""));
  });

  it("shows what was already written today", async () => {
    await reflectionDB.save("Ate the frog before lunch");
    renderWithIntl(<ReflectionField />);

    await waitFor(() =>
      expect(field()).toHaveValue("Ate the frog before lunch")
    );
  });

  it("keeps a note when the field loses focus", async () => {
    renderWithIntl(<ReflectionField />);
    await waitFor(() => expect(field()).toHaveValue(""));

    await userEvent.type(field(), "Two blocks, no phone");
    await userEvent.tab();

    await waitFor(async () =>
      expect((await reflectionDB.getForDay())?.note).toBe(
        "Two blocks, no phone"
      )
    );
    expect(await screen.findByRole("status")).toHaveTextContent("Saved");
  });

  /**
   * The bug this guards is subtle and destructive: the stored note arrives a
   * tick after the first render, so a box seeded from the loading state holds
   * `""` — and the first blur would save that empty string over a real note
   * the reader had written earlier in the day.
   */
  it("does not wipe an existing note when focus passes through", async () => {
    await reflectionDB.save("Written this morning");
    renderWithIntl(<ReflectionField />);

    await waitFor(() => expect(field()).toHaveValue("Written this morning"));
    await userEvent.click(field());
    await userEvent.tab();

    expect((await reflectionDB.getForDay())?.note).toBe("Written this morning");
  });

  /** "Twice": revising replaces the note rather than adding a second one. */
  it("replaces the note when it is rewritten", async () => {
    await reflectionDB.save("First thought");
    renderWithIntl(<ReflectionField />);
    await waitFor(() => expect(field()).toHaveValue("First thought"));

    await userEvent.clear(field());
    await userEvent.type(field(), "Better thought");
    await userEvent.tab();

    await waitFor(async () =>
      expect((await reflectionDB.getForDay())?.note).toBe("Better thought")
    );
    expect(await db.reflections.count()).toBe(1);
  });

  /** "Undo": an empty box is not a blank reflection, it is no reflection. */
  it("removes the note when the field is emptied", async () => {
    await reflectionDB.save("Something");
    renderWithIntl(<ReflectionField />);
    await waitFor(() => expect(field()).toHaveValue("Something"));

    await userEvent.clear(field());
    await userEvent.tab();

    await waitFor(async () =>
      expect(await reflectionDB.getForDay()).toBeUndefined()
    );
  });

  it("writes nothing for a day left blank", async () => {
    renderWithIntl(<ReflectionField />);
    await waitFor(() => expect(field()).toHaveValue(""));

    await userEvent.click(field());
    await userEvent.tab();

    expect(await db.reflections.count()).toBe(0);
  });

  it("says nothing about saving until something is saved", async () => {
    renderWithIntl(<ReflectionField />);
    await waitFor(() => expect(field()).toHaveValue(""));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("drops the saved notice once the note is edited again", async () => {
    renderWithIntl(<ReflectionField />);
    await waitFor(() => expect(field()).toHaveValue(""));

    await userEvent.type(field(), "A win");
    await userEvent.tab();
    await screen.findByRole("status");

    await userEvent.type(field(), " and another");

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
