// @vitest-environment node
import { describe, expect, it } from "vitest";
import { defaultCreateValues } from "../components/agent-config-defaults";
import {
  buildNewAgentDefaultCreateValues,
  createValuesForAdapterType,
  resolveNewAgentDefaultAdapterType,
  resolveNewAgentAdapterSelection,
} from "./new-agent-create-values";

describe("new agent create values", () => {
  it("inherits the CEO adapter type when no explicit preset is provided", () => {
    expect(
      resolveNewAgentDefaultAdapterType({
        companyAgents: [
          { role: "ceo", adapterType: "pi_local" },
          { role: "engineer", adapterType: "codex_local" },
        ],
      }),
    ).toBe("pi_local");
  });

  it("prefers an explicit preset adapter type over the CEO adapter type", () => {
    expect(
      resolveNewAgentDefaultAdapterType({
        companyAgents: [{ role: "ceo", adapterType: "pi_local" }],
        presetAdapterType: "codex_local",
      }),
    ).toBe("codex_local");
  });

  it("falls back to the global default when no CEO adapter is available", () => {
    expect(resolveNewAgentDefaultAdapterType()).toBe(defaultCreateValues.adapterType);
  });

  it("builds pi-local create values without codex-specific defaults", () => {
    const values = createValuesForAdapterType("pi_local");
    expect(values.adapterType).toBe("pi_local");
    expect(values.model).toBe("");
    expect(values.dangerouslyBypassSandbox).toBe(defaultCreateValues.dangerouslyBypassSandbox);
  });

  it("updates the inherited adapter until the user changes it", () => {
    expect(
      resolveNewAgentAdapterSelection({
        currentAdapterType: "codex_local",
        nextDefaultAdapterType: "pi_local",
        userSelectedAdapter: false,
      }),
    ).toBe("pi_local");
  });

  it("preserves an adapter the user explicitly selected", () => {
    expect(
      resolveNewAgentAdapterSelection({
        currentAdapterType: "codex_local",
        nextDefaultAdapterType: "pi_local",
        userSelectedAdapter: true,
      }),
    ).toBe("codex_local");
  });

  it("builds new-agent defaults from the CEO adapter type", () => {
    const values = buildNewAgentDefaultCreateValues({
      companyAgents: [{ role: "ceo", adapterType: "pi_local" }],
    });
    expect(values.adapterType).toBe("pi_local");
  });
});
