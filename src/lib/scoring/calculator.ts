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

  // Calculate player performance ratings (0-10 scale)
  calculatePerformanceRating(stats: MatchStats): number {
    const points = this.calculatePoints(stats);
    
    // Convert points to a 0-10 scale
    // Assuming 0 points = 0 rating, and 20 points = 10 rating
    let rating = (points / 20) * 10;
    
    // Clamp between 0 and 10
    rating = Math.max(0, Math.min(10, rating));
    
    return Math.round(rating * 10) / 10; // Round to 1 decimal place
  }

  // Calculate average rating over multiple matches
  calculateAverageRating(statsList: MatchStats[]): number {
    if (statsList.length === 0) return 0;
    
    const totalRating = statsList.reduce((sum, stats) => {
      return sum + this.calculatePerformanceRating(stats);
    }, 0);
    
    return Math.round((totalRating / statsList.length) * 10) / 10;
  }
}
