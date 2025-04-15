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
    
    return points;
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
}
