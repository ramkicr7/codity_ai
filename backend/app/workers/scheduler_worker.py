import time
import traceback

from app.main import app
from app.repositories.job_repository import JobRepository


POLL_INTERVAL = 5  


def run_scheduler():
    """
    Background worker that continuously polls the queue
    and executes pending jobs.
    """

    with app.app_context():

        print("=" * 60)
        print("Scheduler Worker Started")
        print("=" * 60)

        while True:

            try:

                
                job = JobRepository.claim_next_job()

                if not job:
                    print("No pending jobs found...")
                    time.sleep(POLL_INTERVAL)
                    continue

                print(f"\nClaimed Job: {job.id}")
                print(f"Title: {job.title}")

            
                JobRepository.mark_running(job)

                print("Executing job...")

                

                time.sleep(3)      

                JobRepository.mark_completed(
                    job,
                    result={
                        "message": "Job completed successfully."
                    }
                )

                print("Job completed.")

            except Exception as e:

                print(traceback.format_exc())

                if "job" in locals() and job:

                    JobRepository.mark_failed(
                        job,
                        str(e)
                    )

                time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    run_scheduler()