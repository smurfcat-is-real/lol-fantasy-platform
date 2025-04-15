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

  // Apply role-specific modifiers to points
  applyRoleModifiers(points: number, role: string): number {
    const roleModifiers: Record<string, number> = {
      'TOP': 1.0,
      'JUNGLE': 1.05,
      'MID': 1.1,
      'BOT': 1.15,
      'SUPPORT': 0.9
    };
    
    const modifier = roleModifiers[role] || 1.0;
    return Math.round(points * modifier * 100) / 100;
  }
}
