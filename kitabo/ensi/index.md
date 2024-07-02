# Preface

To determine the top 10 largest files in the `local` directory, you can use the following command in your terminal:

```bash
find local -type f -exec du -h {} + | sort -rh | head -n 10

# 256MG!!! WTF does it do? And its hidden!
rm local/.git/objects/pack/pack-df71aa0deae6d558002db9554b659b336dc90672.pack
```

Here's a breakdown of what this command does:

- `find local -type f`: Finds all files (`-type f`) in the `local` directory.
- `-exec du -h {} +`: Executes `du -h` (disk usage in human-readable format) on each file found.
- `sort -rh`: Sorts the output in reverse order by human-readable numbers.
- `head -n 10`: Displays the top 10 results.

This command will list the top 10 largest files in the `local` directory, sorted by size in descending order.

> *Howard University revoking Sean Combs' honorary doctorate of laws feels like a symbolic recalibration. Combs, a figure embodying the chaotic, creative, and boundary-pushing essence of Dionysian energy, was perhaps an odd fit for an honor typically associated with Apollonian order, structure, and rationality. His contributions to music and culture are significant, but they represent a different kind of achievement, one more aligned with breaking norms and fostering creativity than with the legal or academic rigor that an honorary law doctorate implies. This move by Howard might be seen as an attempt to maintain the integrity of their honors, aligning their accolades more closely with the values and accomplishments they traditionally recognize.*

- Dionysus (individual: 1, 2, 3)
- [Sing](https://en.wikisource.org/wiki/An_Attempt_at_Self-Criticism#3), [O Muse](https://www.gutenberg.org/files/2199/2199-h/2199-h.htm#chap01) ([4](https://github.com/abikesa/lor))[.](https://thedig.howard.edu/all-stories/howard-university-board-trustees-votes-accept-return-honorary-degree-issued-sean-combs-end)
- Apollo ([group](https://www.youtube.com/watch?v=l50EVw7C7ks): 5, 6)


                           1. Meaning
                                     \
                      2. Patterns -> 4. Values -> 5. Identity -> 6. Recognition
                                     /
                                     3. Consequences 
            
      

## [Linear](https://en.wikipedia.org/wiki/Log-linear_model) 1, 2, 3
- Gaussian; `odds`, `bet`, `payout`: Dionysus

## Categorical 4
- Ranking; `character`: Hinduism

## Binary 5, 6
- Truth; `friendship`, [ethics](https://www.youtube.com/watch?v=GLpbh5d3Hhg): Judeo-Christian

                 1. Probabilistic
                                 \
             2. Neuronetworks -> 4. Central -> 5. Algorithms -> 6. Deterministic
                                 /
                                 3. Graphical 

```{figure} ./self-criticism.png
---
width: 1000px
name: philosophy
alt: an attempt at self-criticism
---
*Its all [here](https://en.wikisource.org/wiki/An_Attempt_at_Self-Criticism)*
```

- [Dude](https://www.youtube.com/shorts/s2gLB2ZqPWc)
- [Theory](https://schlemielintheory.com)


                             1. About Me
                                        \
                           2. Skills -> 4. Recent Posts -> 5. Experiences -> 6. Achievements
                                        /
                                        3. Projects





#### Table of Contents

```{tableofcontents}
```



