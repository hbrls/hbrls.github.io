# -*- coding: utf-8 -*-


def read_file(filename, sep=None):
    with open(filename) as f:
        if sep:
            for line in f.readlines():
                yield tuple(w.strip() for w in line.strip().split(sep))
        else:
            for line in f.readlines():
                yield line.strip()
