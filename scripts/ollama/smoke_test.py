#!/usr/bin/env python3

from __future__ import annotations

import unittest

from ollama_lib import slugify, validate_job_config


class OllamaSmokeTests(unittest.TestCase):
    def test_slugify(self) -> None:
        self.assertEqual(slugify("Mallsing"), "mallsing")
        self.assertEqual(slugify("  Elf (Wood)  "), "elf_wood")
        self.assertEqual(slugify("***"), "image")

    def test_validate_job_config_unknown_key(self) -> None:
        cfg = {
            "version": 1,
            "backend": "ollama",
            "output": {"dir": "assets/portraits/kins"},
            "oops": True,
        }
        with self.assertRaises(SystemExit):
            validate_job_config(cfg)


if __name__ == "__main__":
    unittest.main()
