#!/usr/bin/env python3

from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path

from comfyui_lib import resolve_checkpoint_name, slugify, validate_job_config


class ComfyUISmokeTests(unittest.TestCase):
    def test_slugify(self) -> None:
        self.assertEqual(slugify("Mallsing"), "mallsing")
        self.assertEqual(slugify("  Elf (Wood)  "), "elf_wood")
        self.assertEqual(slugify("***"), "image")

    def test_validate_job_config_unknown_key(self) -> None:
        cfg = {
            "version": 1,
            "output": {"dir": "assets/portraits/kins"},
            "oops": True,
        }
        with self.assertRaises(SystemExit):
            validate_job_config(cfg)

    def test_checkpoint_resolution_priority(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            d = Path(td)
            (d / "a.safetensors").write_bytes(b"x")
            (d / "b.safetensors").write_bytes(b"x")

            # Explicit --ckpt wins.
            name, used_dir = resolve_checkpoint_name("b.safetensors", [d])
            self.assertEqual(name, "b.safetensors")
            self.assertEqual(used_dir, d)

            # Env var wins when no explicit.
            os.environ["COMFYUI_CKPT"] = "a.safetensors"
            try:
                name2, used_dir2 = resolve_checkpoint_name(None, [d])
                self.assertEqual(name2, "a.safetensors")
                self.assertEqual(used_dir2, d)
            finally:
                os.environ.pop("COMFYUI_CKPT", None)

    def test_checkpoint_auto_select_single(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            d = Path(td)
            (d / "only.safetensors").write_bytes(b"x")
            name, used_dir = resolve_checkpoint_name(None, [d])
            self.assertEqual(name, "only.safetensors")
            self.assertEqual(used_dir, d)


if __name__ == "__main__":
    unittest.main()
