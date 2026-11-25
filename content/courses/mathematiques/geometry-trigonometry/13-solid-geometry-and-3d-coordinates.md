---
title: Solid Geometry & 3D Coordinates
minutes: 14
---

## What you will learn

- areas and volumes of common solids;
- parallel and perpendicular relations between lines and planes;
- 3D coordinates, vectors, distances and angles; the sphere.

## 1. Surface areas and volumes

| Solid | Volume | Surface area |
|---|---|---|
| Prism / cylinder ($B$ base area, $h$ height) | $V = Bh$ | cylinder: $2\pi r^2 + 2\pi rh$ |
| Pyramid / cone | $V = \tfrac13Bh$ | cone lateral: $\pi rl$, $l = \sqrt{r^2 + h^2}$ |
| Sphere (radius $R$) | $V = \tfrac43\pi R^3$ | $S = 4\pi R^2$ |
| Frustum | $\tfrac13\pi h(r_1^2 + r_1r_2 + r_2^2)$ | lateral $\pi(r_1 + r_2)l$ |
| Cuboid $a \times b \times c$ | $abc$ | $2(ab + bc + ca)$ |

Space diagonal of a cuboid: $\sqrt{a^2 + b^2 + c^2}$. A cube of edge $a$ inscribed in a sphere has $2R = a\sqrt3$; a sphere inscribed in it has $R = \tfrac a2$. If a solid's dimensions are multiplied by $k$, areas scale by $k^2$ and volumes by $k^3$.

**Example 1.** A cuboid $3 \times 4 \times 12$ has space diagonal $13$. A cone with $r = 3$, $h = 4$: slant $5$, lateral area $15\pi$, volume $12\pi$. A closed cylinder with $r = 1$, $h = 3$: area $8\pi$.

## 2. Lines and planes

- A line parallel to a line in a plane (and not in it) is parallel to the plane.
- Two intersecting lines of $\alpha$ parallel to $\beta$ $\Rightarrow$ $\alpha \parallel \beta$.
- A line perpendicular to **two intersecting** lines of a plane is perpendicular to the plane.
- A plane containing a line perpendicular to another plane is perpendicular to it.

**Angles**: between skew lines (angle between parallels through a point, in $(0, \tfrac\pi2]$); between a line and a plane (angle with its projection); dihedral angle (angle between two perpendiculars to the common edge).

## 3. 3D coordinates

$$
|AB| = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}, \qquad \vec a\cdot\vec b = x_1x_2 + y_1y_2 + z_1z_2.
$$

- Distance to the coordinate planes: $|z|$, $|x|$, $|y|$; to the $x$-axis: $\sqrt{y^2 + z^2}$.
- Symmetric points of $(a, b, c)$: in the $xy$-plane $(a, b, -c)$; in the $x$-axis $(a, -b, -c)$; in the origin $(-a, -b, -c)$.
- **Sphere**: $(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2$.

**Angles and distances with vectors** (direction vectors $\vec u$, $\vec v$; normals $\vec n$):

$$
\cos\theta_{\text{lines}} = \frac{|\vec u\cdot\vec v|}{|\vec u||\vec v|}, \quad \sin\theta_{\text{line–plane}} = \frac{|\vec u\cdot\vec n|}{|\vec u||\vec n|}, \quad \cos\theta_{\text{planes}} = \frac{|\vec n_1\cdot\vec n_2|}{|\vec n_1||\vec n_2|},
$$

$$
d(P, \text{plane } Ax + By + Cz + D = 0) = \frac{|Ax_0 + By_0 + Cz_0 + D|}{\sqrt{A^2 + B^2 + C^2}}.
$$

**Choosing axes**: at a vertex where three perpendicular edges meet.

**Example 2.** Unit cube $A(0,0,0)$, $B(1,0,0)$, $D(0,1,0)$, $A_1(0,0,1)$, $C(1,1,0)$. The angle between $A_1B$ and $AC$: $\overrightarrow{A_1B} = (1, 0, -1)$, $\overrightarrow{AC} = (1, 1, 0)$; $\cos\theta = \dfrac1{\sqrt2\sqrt2} = \dfrac12$, $\theta = 60^\circ$.

**Example 3.** Distance from $A_1$ to plane $BDC_1$ ($B(1,0,0)$, $D(0,1,0)$, $C_1(1,1,1)$): normal $(1, 1, -1)$, plane $x + y - z - 1 = 0$; $d = \dfrac{|0 + 0 - 1 - 1|}{\sqrt3} = \dfrac{2\sqrt3}3$.

**Example 4.** Symmetric point of $(2, -3, 5)$ about the $xz$-plane: $(2, 3, 5)$.

**Example 5.** Distance from $(1, 2, 3)$ to $2x - y + 2z - 4 = 0$: $\dfrac{|2 - 2 + 6 - 4|}3 = \dfrac23$.

**Cross-section.** A plane at distance $d$ from the centre cuts a sphere in a circle of radius $\sqrt{R^2 - d^2}$.

## Common mistakes

- Using $V = Bh$ for a pyramid.
- Confusing slant height with height.
- Giving an angle between lines greater than $90^\circ$ (take the absolute value).

## Practice problems

1. A sphere of radius $3$ is melted into spheres of radius $1$: how many?
2. Space diagonal of a cube of edge $2$.
3. Distance from the origin to $x + 2y + 2z = 9$.

**Answers.** (1) $27$. (2) $2\sqrt3$. (3) $\dfrac93 = 3$.
