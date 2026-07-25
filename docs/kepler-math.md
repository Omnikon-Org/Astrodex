# Keplerian Orbital Mechanics in AstroDex

AstroDex simulates the movement of asteroids and orbital debris using real-world Keplerian orbital mechanics. All physics logic is centralized in `src/lib/kepler.ts`. 

## 1. Mean Motion ($n$)

Mean motion is the angular speed required for a body to complete one orbit, assuming constant speed in a circular orbit.

$$ n = \sqrt{\frac{\mu}{a^3}} $$

Where:
- $\mu$ (Mu) = Standard gravitational parameter of Earth ($3.986 \times 10^{14} \text{ m}^3/\text{s}^2$)
- $a$ = Semi-major axis (in meters)

*Implementation Note: In AstroDex, we calculate this once per object upon generation and cache it to avoid redundant square roots per frame.*

## 2. Mean Anomaly ($M$)

The Mean Anomaly represents the fraction of an orbit's period that has elapsed since periapsis (closest approach).

$$ M = M_0 + n \times t $$

Where:
- $M_0$ = Mean Anomaly at epoch (start time $t=0$)
- $n$ = Mean motion
- $t$ = Time elapsed

## 3. Kepler's Equation & Eccentric Anomaly ($E$)

To find the actual position of the object on its elliptical path, we must relate the Mean Anomaly ($M$) to the Eccentric Anomaly ($E$). They are related by Kepler's Equation:

$$ M = E - e \sin(E) $$

Where:
- $e$ = Eccentricity of the orbit (0 for circular, 0 < e < 1 for elliptical)

Because this equation is transcendental (it cannot be solved algebraically for $E$), AstroDex uses the **Newton-Raphson iteration method** to approximate $E$:

$$ E_{k+1} = E_k - \frac{E_k - e \sin(E_k) - M}{1 - e \cos(E_k)} $$

We loop this calculation a fixed number of times (e.g., 5-10 iterations) per frame per asteroid. Since we have ~600 asteroids, this math is optimized.

## 4. True Anomaly ($\nu$)

Once we have $E$, we calculate the True Anomaly, which is the actual angle of the object from periapsis.

$$ \cos(\nu) = \frac{\cos(E) - e}{1 - e \cos(E)} $$
$$ \sin(\nu) = \frac{\sqrt{1 - e^2} \sin(E)}{1 - e \cos(E)} $$

## 5. Distance to Central Body ($r$)

The distance from Earth's center to the object is:

$$ r = a (1 - e \cos(E)) $$

## 6. Converting to 3D Cartesian Coordinates

With $r$ and $\nu$ calculated in the 2D orbital plane, we apply the 3D rotation based on the inclination ($i$), longitude of ascending node ($\Omega$), and argument of periapsis ($\omega$).

$$ x = r (\cos(\Omega) \cos(\omega + \nu) - \sin(\Omega) \sin(\omega + \nu) \cos(i)) $$
$$ y = r (\sin(\Omega) \cos(\omega + \nu) + \cos(\Omega) \sin(\omega + \nu) \cos(i)) $$
$$ z = r (\sin(\omega + \nu) \sin(i)) $$

## 7. Orbital Velocity (Vis-Viva Equation)

AstroDex displays real-time orbital velocity when an object is selected. This is calculated using the Vis-Viva equation:

$$ v = \sqrt{\mu \left(\frac{2}{r} - \frac{1}{a}\right)} $$

Where $v$ is the velocity in meters per second. This accurately reflects that objects move faster at periapsis and slower at apoapsis.
