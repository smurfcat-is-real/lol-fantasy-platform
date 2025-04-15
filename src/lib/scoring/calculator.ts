export interface MatchStats {
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  victory: boolean;
}

export class ScoreCalculator {
  private readonly POINTS = {
    KILL: 3,
    DEATH: -1,
    ASSIST: 1,
    CS: 0.02,
    VICTORY: 2,
    KDA_BONUS: 2,
  };

  calculatePoints(stats: MatchStats): number {
    let points = 0;
    
    // Base points
    points += stats.kills * this.POINTS.KILL;
    points += stats.deaths * this.POINTS.DEATH;
    points += stats.assists * this.POINTS.ASSIST;
    points += stats.cs * this.POINTS.CS;
    
    // Victory bonus
    if (stats.victory) {
      points += this.POINTS.VICTORY;
    }
    
    // KDA bonus
    const kda = this.calculateKDA(stats);
    if (kda >= 3) {
      points += this.POINTS.KDA_BONUS;
    }
    
    return Math.round(points * 100) / 100; // Round to 2 decimal places
  }

  private calculateKDA(stats: MatchStats): number {
    return (stats.kills + stats.assists) / Math.max(1, stats.deaths);
  }

  // Calculate points for a batch of match stats
  calculateBatchPoints(statsList: MatchStats[]): number {
    return statsList.reduce((total, stats) => {
      return total + this.calculatePoints(stats);
    }, 0);
  }

  // Calculate fantasy points based on role-specific performance
  calculateRoleAdjustedPoints(stats: MatchStats, role: string): number {
    let points = this.calculatePoints(stats);
    
    // Apply role-specific modifiers
    switch (role.toUpperCase()) {
      case 'TOP':
        // Top laners get bonus for high CS
        if (stats.cs > 200) {
          points += 1;
        }
        break;
      case 'JUNGLE':
        // Junglers get bonus for high assist counts
        if (stats.assists > 10) {
          points += 1.5;
        }
        break;
      case 'MID':
        // Mid laners get bonus for high kill counts
        if (stats.kills > 5) {
          points += 1;
        }
        break;
      case 'BOT':
        // Bot laners (ADCs) get bonus for high CS and kills
        if (stats.cs > 220 && stats.kills > 4) {
          points += 1.5;
        }
        break;
      case 'SUPPORT':
        // Supports get more points for assists
        points += stats.assists * 0.5;
        break;
    }
    
    return Math.round(points * 100) / 100; // Round to 2 decimal places
  }
}
